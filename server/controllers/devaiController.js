const { getChatReply } = require("../helper/getChatReply");

module.exports.askDevai = async (req, res) => {
    try {
        const {query} = req.body;
        console.log("this is query: ", query)
        const reply = await getChatReply(query);
        return res.status(200).json({
            msg: reply,
            success: true
        })
    }catch (err) {
        console.error("the error in askDevai is: ", err);
        return res.status(500).json({
            msg: "Some error occured in askDevai",
            success: false,
            error: err
        })
    }
}