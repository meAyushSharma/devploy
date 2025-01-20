const express = require("express");
const router = express.Router();

const { userRouter } = require("./userRoutes");
const { dockerRouter } = require("./dockerRoutes");
const { devaiRouter } = require("./devaiRoutes");

const { registrySearchController } = require("../controllers/registrySearchController");
const { crossOriginMiddleware } = require("../middlewares/crossOriginMiddleware");
const catchAsync = require("../utils/catchAsync");

router.use('/user', userRouter);
router.use('/docker', dockerRouter);
router.use('/devai', devaiRouter);

router.get('/search', crossOriginMiddleware, catchAsync(registrySearchController))

module.exports = { router };