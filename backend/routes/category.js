const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/category");
const { isAuthenticated, isAuthorized } = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");

const { verifyAccessToken } = require("../helpers/token");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin"]),
  create
);
router.get("/category/:slug", read);
router.delete(
  "/category/:slug",
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin"]),
  remove
);
router.get("/categories", list);

module.exports = router;
