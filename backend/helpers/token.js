const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signAccessToken = (user) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: "10m", // 10 minutes
  };
  const token = jwt.sign({ _id: user._id, role: user.role }, secret, options);
  return token;
};

exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"])
    return res.status(401).json("User not logged in");
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return res.status(401).json("User not logged in");
    }
    req.user = {
      _id: payload._id,
      role: payload.role,
    };
    next();
  });
};

exports.signRefreshToken = (res, user) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiration = 2592000000; // 1 month in ms
  const options = {
    expiresIn: expiration,
  };
  const token = jwt.sign({ _id: user._id }, secret, options);

  User.findByIdAndUpdate(user._id, { refreshToken: token }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  return res.cookie("refreshToken", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true if your using https
    sameSite: "Lax",
    httpOnly: true,
  });
};

exports.verifyRefreshToken = (res, refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject("Unauthorized");
        const userId = payload._id;

        User.findById({ _id: userId })
          .select("_id refreshToken role")
          .exec((err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error: "User not found",
              });
            }
            if (refreshToken === user.refreshToken) return resolve(user);
            reject(err);
          });
      }
    );
  });
};
