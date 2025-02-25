const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser, googleAuth, refreshGoogleAuthToken, mailVerification } = require("../controllers/authController");
const authRouter = express.Router();

// authentication queries

authRouter.post('/verify-email', catchAsync(mailVerification));
authRouter.post('/signup', catchAsync(registerUser));
authRouter.post('/login', catchAsync(loginUser));
authRouter.post('/google', catchAsync(googleAuth));
authRouter.post('/google/refresh-token', catchAsync(refreshGoogleAuthToken)); /* not in use currently */

module.exports = { authRouter }