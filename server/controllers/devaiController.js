const { getChatReply } = require("../helper/getChatReply");
const ExpressError = require("../utils/ExpressError");

module.exports.askDevai = async (req, res, next) => {
    try {
        const {query} = req.body;
        console.log(`This is user message array:\n`, query);
        const reply = await getChatReply(query);
        if(reply) return res.status(200).json({ msg: reply, success: true })
        else throw new ExpressError("Failed to get reply from AI <(＿　＿)>", 500);

    }catch (err) {
        next(err)
    }
}