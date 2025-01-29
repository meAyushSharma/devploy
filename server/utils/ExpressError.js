class ExpressError extends Error {
    constructor(message, statusCode, {redirect = null, error = null}) {
        super(message);
        this.statusCode = statusCode;
        this.redirect = redirect;
        this.error = error;
    }
}

module.exports = ExpressError;
