const express = require("express");
const router = express.Router();

// controllers
const { adminMiddleware } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/tag");

// validators
const { runValidation } = require("../validators");
const { tagCreateValidator } = require("../validators/tag");

const { verifyToken } = require("../helpers/token");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  verifyToken,
  adminMiddleware,
  create
);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", verifyToken, adminMiddleware, remove);
router.get("/tags", list);

module.exports = router;
