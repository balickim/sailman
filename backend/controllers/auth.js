const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const Blog = require("../models/blog");

const { sendEmailWithNodemailer } = require("../helpers/email");

// helpers
const { errorHandler } = require("../helpers/dbErrorHandler");
const { response } = require("express");
const { generateToken } = require("../helpers/token");
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

    generateToken(res, user);

    return res.json({
      // token,
      user: { _id, username, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Sign out success.",
  });
};

exports.authMiddleware = (req, res, next) => {
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

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
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

            generateToken(res, user);

            return res.json({
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

              generateToken(res, user);

              return res.json({
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
