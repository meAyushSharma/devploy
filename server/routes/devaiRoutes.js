const express = require("express");
const devaiRouter = express.Router();
const catchAsync = require("../utils/catchAsync");
const devaiController = require("../controllers/devaiController");

devaiRouter.post("/ask", catchAsync(devaiController.askDevai));

module.exports = {devaiRouter}