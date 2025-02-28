const resend = require("../utils/resend");
const NODE_ENV = process.env.NODE_ENV;
const EMAIL_SENDER = process.env.EMAIL_SENDER;

const getFromEmail = () => NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getToEmail = to => NODE_ENV === "development" ? "delivered@resend.dev" : to;

module.exports.sendMail = async ({ to, subject, text, html }) =>
    await resend.emails.send({
      from: getFromEmail(),
      to: getToEmail(to),
      subject,
      text,
      html,
});