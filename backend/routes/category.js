const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/category");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");

const { verifyToken } = require("../helpers/token");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  verifyToken,
  adminMiddleware,
  create
);
router.get("/category/:slug", read);
router.delete("/category/:slug", verifyToken, adminMiddleware, remove);
router.get("/categories", list);

module.exports = router;
