const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  preSignup,
  googleLogin,
  refreshToken,
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

router.post("/pre-signup", userSignupValidator, runValidation, preSignup);
router.post("/signup", signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

router.post("/refresh-token", refreshToken);

// google
router.post("/google-login", googleLogin);

module.exports = router;
