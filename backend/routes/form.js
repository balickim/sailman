const express = require("express");
const router = express.Router();
const { contactForm, feedbackForm } = require("../controllers/form");
const { authMiddleware } = require("../controllers/auth");
const { verifyToken } = require("../helpers/token");

// validators
const { runValidation } = require("../validators");
const { contactFormValidator } = require("../validators/form");

router.post("/contact", contactFormValidator, runValidation, contactForm);
router.post("/feedback", verifyToken, authMiddleware, feedbackForm);

module.exports = router;
