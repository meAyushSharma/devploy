const express = require("express");
const router = express.Router();

const { userRouter } = require("./userRoutes");
const { dockerRouter } = require("./dockerRoutes");
const { devaiRouter } = require("./devaiRoutes");
const { authRouter } = require("./authRoutes");

const { registrySearchController } = require("../controllers/registrySearchController");
const catchAsync = require("../utils/catchAsync");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use('/user', catchAsync(authMiddleware), userRouter);
router.use('/docker', catchAsync(authMiddleware), dockerRouter);
router.use('/devai', catchAsync(authMiddleware), devaiRouter);
router.use('/auth', authRouter);

router.get('/search', catchAsync(registrySearchController))

module.exports = { router };