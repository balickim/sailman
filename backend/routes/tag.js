const express = require("express");
const router = express.Router();

// controllers
const { isAuthenticated, isAuthorized } = require("../controllers/auth");
const { create, list, read, remove } = require("../controllers/tag");

// validators
const { runValidation } = require("../validators");
const { tagCreateValidator } = require("../validators/tag");

const { verifyAccessToken } = require("../helpers/token");

router.post(
  "/tag",
  tagCreateValidator,
  runValidation,
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin"]),
  create
);
router.get("/tag/:slug", read);
router.delete(
  "/tag/:slug",
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin"]),
  remove
);
router.get("/tags", list);

module.exports = router;
