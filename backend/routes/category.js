const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/category");
const { authMiddleware, isAuthorized } = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");

const { verifyToken } = require("../helpers/token");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  verifyToken,
  authMiddleware,
  isAuthorized(["admin"]),
  create
);
router.get("/category/:slug", read);
router.delete(
  "/category/:slug",
  verifyToken,
  authMiddleware,
  isAuthorized(["admin"]),
  remove
);
router.get("/categories", list);

module.exports = router;
