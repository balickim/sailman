const express = require('express');
const router = express.Router();
const { signup, signIn } = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSignInValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSignInValidator, runValidation, signIn);

module.exports = router;