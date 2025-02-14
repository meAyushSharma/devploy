const { getChatReply } = require("../helper/getChatReply");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");

module.exports.askDevai = async (req, res, next) => {
    try {
        const {query} = req.body;
        console.log(`This is user message array:\n`, query);
        const reply = await getChatReply(query);
        if(reply) return res.status(statusCodes.Ok).json({ msg: reply, success: true })
        else return next(new ExpressError("Failed to get reply from AI <(＿　＿)>", statusCodes["Server Error"], {error : "error in getting reply from ai"}));

    }catch (err) {
        next(err)
    }
}