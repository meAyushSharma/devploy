const fs = require("fs");
const path = require("path");

function logErrorToFile(error) {
    const logPath = path.join(__dirname, "../logs/error.log");
    const errorMessage = `[${new Date().toISOString()}] ${error.stack || error}\n`;
    
    fs.appendFileSync(logPath, errorMessage, "utf8");
}

function globalErrorHandler(error, origin) {
    console.error(`🔥 Critical Error: ${error.message || error}`);
    
    logErrorToFile(error);

    console.log("🚨 Application is shutting down due to a critical error...");
    setTimeout(() => {
        process.exit(1);
    }, 500);
}

function registerGlobalErrorHandlers() {
    process.on("uncaughtException", (err) => {
        globalErrorHandler(err, "Uncaught Exception");
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
        globalErrorHandler(reason, "Unhandled Rejection");
    });

    process.on("SIGTERM", () => {
        console.log("Received SIGTERM, shutting down gracefully...");
        process.exit(0);
    });

    process.on("SIGINT", () => {
        console.log("Received SIGINT (Ctrl+C), shutting down gracefully...");
        process.exit(0);
    });
}

module.exports = { registerGlobalErrorHandlers };
