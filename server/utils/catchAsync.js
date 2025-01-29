const ExpressError = require("./ExpressError")

module.exports = func => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (err) {
            if (!res.headersSent) {
                next(err instanceof ExpressError ? err : new ExpressError(err.message, 500));
            } else {
                console.error("Error occurred after response was sent:", err);
            }
        }
    };
};
