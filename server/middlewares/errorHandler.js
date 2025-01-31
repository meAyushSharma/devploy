const statusCodes = require("../utils/statusCodes");

module.exports.errorHandler = (err, req, res, next) => {
    console.error(`Error:\n`, err);
    
    const { statusCode = statusCodes["Server Error"] , message = "Something went wrong" } = err;

    res.status(statusCode).json({
        success : false,
        msg : message,
        error : err.error || err || "Something went wrong at server",
    });
};