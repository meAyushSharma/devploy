const { forgotPasswordTemplate } = require("../views/forgotPasswordTemplate");
const { verifyEmailTemplate } = require("../views/verifyEmailTemplate");

module.exports.getVerifyEmailTemplate = code =>  ({
    subject: "Verify Email Address",
    text: `Copy on the code and paste in signup window to verify your email address.`,
    html: verifyEmailTemplate(code),
})

module.exports.getForgotPasswordTemplate = code => ({
    subject: "Forgot Password Request",
    text: `Copy on the code and paste in forgot password window to set new password.`,
    html: forgotPasswordTemplate(code),
})