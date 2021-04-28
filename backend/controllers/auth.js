const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const Announcement = require("../models/announcement");

const { sendEmailWithNodemailer } = require("../helpers/email");

// helpers
const { errorHandler } = require("../helpers/dbErrorHandler");
const { response } = require("express");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/token");
const e = require("express");

exports.preSignup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const emailData = {
      from: `${process.env.EMAIL_FROM}`,
      to: email,
      subject: `${process.env.APP_NAME} account activation link`,
      html: `
          <p>Use the following email to activate your password:</p>
          <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
      `,
    };

    sendEmailWithNodemailer(req, res, emailData);
  });
};

exports.signup = (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }

        const { name, email, password } = jwt.decode(token);

        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        const user = new User({ name, email, password, profile, username });
        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: errorHandler(err),
            });
          }
          return res.json({
            message: "Signup success! Please signin",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password does not match.",
      });
    }
    const { _id, username, name, email, role } = user;

    const accessToken = signAccessToken(user);
    signRefreshToken(res, user);

    return res.json({
      accessToken,
      user: { _id, username, name, email, role },
    });
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || "";
    if (!refreshToken) throw res.status(400);
    const user = await verifyRefreshToken(res, refreshToken);

    const accessToken = await signAccessToken(user);
    // const refToken = await signRefreshToken(userId);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

exports.signout = (req, res) => {
  const refreshToken = req.cookies.refreshToken || "";

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return reject("Unauthorized");
    const userId = payload._id;

    User.findByIdAndUpdate(
      userId,
      { $pull: { refreshToken: refreshToken } },
      function (err) {
        if (err) {
          console.log(err);
          res.json(err);
        } else {
          res.clearCookie("refreshToken");

          res.json({
            message: "Sign out success.",
          });
        }
      }
    );
  });
};

exports.isAuthenticated = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId })
    .select("-photo -hashed_password")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user;
      next();
    });
};

exports.isAuthorized = (opts, allowSameUser) => {
  allowSameUser = allowSameUser ?? false;

  return (req, res, next) => {
    const appRolesList = ["user", "moderator", "admin"];

    if (appRolesList.some((v) => opts.includes(v))) {
      const { role, _id, username } = req.profile; // from db
      const paramUsername = req.params.username; // from token

      if (allowSameUser && paramUsername && username === paramUsername)
        return next();

      if (!role)
        return res.status(403).json({
          error: "No role submitted.",
        });

      if (opts.includes(role)) return next();

      return res.status(403).json({
        error: "Admin resource. Access denied.",
      });
    } else {
      res.json("Role unknown or not given");
    }
  };
};

exports.canUpdateDeleteAnnouncement = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Announcement.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    const emailData = {
      from: `${process.env.EMAIL_FROM}`,
      to: email,
      subject: `${process.env.APP_NAME} password reset"`,
      html: `
          <p>Use the following email to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
      `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sendEmailWithNodemailer(req, res, emailData);
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            error: "Link expired.",
          });
        }
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(401).json({
              error: "Something went wrong. Try again later.",
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            }
            res.json({
              message: "Password changed successfully.",
            });
          });
        });
      }
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email, jti } = response.payload;

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const { _id, email, name, role, username } = user;

            const accessToken = signAccessToken(user);
            signRefreshToken(res, user);

            return res.json({
              accessToken,
              user: { _id, email, name, role, username },
            });
          } else {
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti;
            user = new User({ name, email, profile, username, password });

            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }
              const { _id, email, name, role, username } = data;

              const accessToken = signAccessToken(user);
              signRefreshToken(res, user);

              return res.json({
                accessToken,
                user: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google log in failed, please try again.",
        });
      }
    });
};
