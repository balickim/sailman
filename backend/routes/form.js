const express = require("express");
const router = express.Router();
const { contactForm, feedbackForm } = require("../controllers/form");
const { isAuthenticated } = require("../controllers/auth");
const { verifyAccessToken } = require("../helpers/token");

// validators
const { runValidation } = require("../validators");
const { contactFormValidator } = require("../validators/form");

router.post("/contact", contactFormValidator, runValidation, contactForm);
router.post("/feedback", verifyAccessToken, isAuthenticated, feedbackForm);

module.exports = router;
