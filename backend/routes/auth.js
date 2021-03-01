const express = require('express');
const router = express.Router();
const { signup, signIn, signOut, requireSignIn } = require('../controllers/auth');

// validators
const { runValidation } = require('../validators');
const { userSignupValidator, userSignInValidator } = require('../validators/auth');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signIn', userSignInValidator, runValidation, signIn);
router.get('/signOut', signOut);

module.exports = router;