const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
    try{
        // can have two types of cookies either 
        const registerToken = req.cookies["registerToken"];
        const googleToken = req.cookies["googleToken"];
        const authToken = registerToken || googleToken;
        if(!authToken) return res.status(401).json({
            success:false,
            msg:"Authentication failed",
            error:"Authentication token not found"
        })
        const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        // google token => email, id, name, passowrd, gid, profilepic, isGUser
        req.user = verifiedToken;
        next();
    }catch(err) {
        console.log("Error in authenticating user is: ", err);
        if (!res.headersSent) {
            return res.status(401).json({
                success: false,
                msg: "Invalid or expired authentication token",
                error: err.message
            });
        }
    }
}