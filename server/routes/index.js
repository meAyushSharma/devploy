const express = require("express");
const router = express.Router();
const {userRouter} = require("./userRoutes");
const {dockerRouter} = require("./dockerRoutes");

router.use('/user', userRouter);
router.use('/docker', dockerRouter);

module.exports = { router };