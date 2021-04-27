const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../controllers/auth");

const {
  read,
  publicProfile,
  update,
  photo,
  me,
} = require("../controllers/user");

const { verifyAccessToken } = require("../helpers/token");

router.get("/user/profile", verifyAccessToken, isAuthenticated, read);
router.get("/user/me", verifyAccessToken, isAuthenticated, me);
router.get("/user/:username", publicProfile);
router.put("/user/update", verifyAccessToken, isAuthenticated, update);
router.get("/user/photo/:username", photo);

module.exports = router;
