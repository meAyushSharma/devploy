const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser, googleAuth, refreshGoogleAuthToken, mailVerification, verifyEmailForgotPass, forgotPasswordReset } = require("../controllers/authController");
const authRouter = express.Router();

/* authentication queries */
authRouter.post('/verify-email', catchAsync(mailVerification));
authRouter.post('/signup', catchAsync(registerUser));
authRouter.post('/login', catchAsync(loginUser));
authRouter.post('/google', catchAsync(googleAuth));

/* unauthorized forgot password reset apis */
authRouter.post("/verify-email-forgotpass", catchAsync(verifyEmailForgotPass));
authRouter.post("/forgot-password-reset", catchAsync(forgotPasswordReset));
 
/* not in use currently */
authRouter.post('/google/refresh-token', catchAsync(refreshGoogleAuthToken));

module.exports = { authRouter }