const jwt = require("jsonwebtoken");

exports.generateToken = (res, user) => {
  const expiration = 43204500;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  return res.cookie("token", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token || "";
  try {
    if (!token) {
      return res.status(401).json("You need to Login");
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decrypt._id,
    };
    next();
  } catch (err) {
    return res.status(500).json(err.toString());
  }
};
