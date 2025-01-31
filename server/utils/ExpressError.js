class ExpressError extends Error {
    constructor(message, statusCode, {error = null}) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
}

module.exports = ExpressError;
