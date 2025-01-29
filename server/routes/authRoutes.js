const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser, googleAuth, refreshGoogleAuthToken } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post('/signup', catchAsync(registerUser));
authRouter.post('/login', catchAsync(loginUser));
authRouter.post('/google', catchAsync(googleAuth));
authRouter.post('/google/refresh-token', catchAsync(refreshGoogleAuthToken));

module.exports = { authRouter }