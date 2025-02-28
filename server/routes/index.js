const express = require("express");
const router = express.Router();

const { userRouter } = require("./userRoutes");
const { orchestrationRouter } = require("./orchestrationRoutes");
const { devaiRouter } = require("./devaiRoutes");
const { authRouter } = require("./authRoutes");

const { registrySearchController, tagSearchRegistry } = require("../controllers/registrySearchController");
const catchAsync = require("../utils/catchAsync");
const { authMiddleware } = require("../middlewares/authMiddleware");
const statusCodes = require("../utils/statusCodes");

router.use('/auth', authRouter);
router.use('/user', catchAsync(authMiddleware), userRouter);
router.use('/container-orchestration', catchAsync(authMiddleware), orchestrationRouter);
router.use('/devai', catchAsync(authMiddleware), devaiRouter);

router.get('/search', catchAsync(registrySearchController));
router.get("/get-tags", catchAsync(tagSearchRegistry));

/* health check route */
router.get('/health', (req, res) => res.status(statusCodes.Ok).json({success: true, msg: "Health check successfull, server running smoothly!!"}));
/* crash test route */
// router.get('/crash', (req, res) => {
//     console.log("Crashing the application...");
//     process.exit(1);
// })

module.exports = { router };