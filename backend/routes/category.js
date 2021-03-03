const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/category");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

// validators
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");

router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);
router.get("/categories", list);

module.exports = router;
