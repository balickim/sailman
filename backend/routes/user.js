const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/auth");

const {
  read,
  publicProfile,
  update,
  photo,
  me,
} = require("../controllers/user");

const { verifyToken } = require("../helpers/token");

router.get("/user/profile", verifyToken, authMiddleware, read);
router.get("/user/me", verifyToken, authMiddleware, me);
router.get("/user/:username", publicProfile);
router.put("/user/update", verifyToken, authMiddleware, update);
router.get("/user/photo/:username", photo);

module.exports = router;
