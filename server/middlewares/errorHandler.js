const statusCodes = require("../utils/statusCodes");

module.exports.errorHandler = (err, req, res, next) => {
    console.error(`Error:\n`, err);
    if (typeof err !== "object") {
        err = new Error(err);
    }
    
    const statusCode = err.statusCode || statusCodes["Server Error"];
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        success : false,
        msg : message,
        error: process.env.NODE_ENV === "development" ? (err.error || err.stack || "No additional details") : message,
    });
};