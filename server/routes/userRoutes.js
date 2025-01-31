const express = require("express");
const { saveEnvironment, saveCompose, deleteEnvironment, deleteCompose, getUserData } = require("../controllers/userController");
const catchAsync = require("../utils/catchAsync");
const userRouter = express.Router();

// user queries like reset password, forgot password, delete account, save data, fetch data
userRouter.post("/save-env", catchAsync(saveEnvironment));
userRouter.post("/save-compose", catchAsync(saveCompose));
userRouter.post("/del-env", catchAsync(deleteEnvironment));
userRouter.post("/del-compose", catchAsync(deleteCompose));
userRouter.get("/get-data", catchAsync(getUserData));

module.exports = { userRouter };