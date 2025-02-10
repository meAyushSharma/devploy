const jwt = require("jsonwebtoken");
const statusCodes = require("../utils/statusCodes");

module.exports.authMiddleware = async (req, res, next) => {
    try{
        // 1. cookie authorization approach
        // const registerToken = req.cookies["registerToken"];
        // const googleToken = req.cookies["googleToken"];
        // const authToken = registerToken || googleToken;
        // if(!authToken) return res.status(statusCodes.Unauthorized).json({
        //     success:false,
        //     msg:"Authentication failed",
        //     error:"Authentication token not found"
        // })

        // 2. header authorization approach
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(statusCodes.Unauthorized).json({ success: false, message: "Unauthorized: No token provided", error:"Authentication token not found" });
        }
        const authToken = authHeader.split(" ")[1];
        try {
            // google token => email, id, name, passowrd, gid, profilepic, isGUser
            const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);
            if(!verifiedToken) res.status(statusCodes.Unauthorized).json({ success: false, message: "Forbidden: Invalid token", error: "invalid auth token" });
            req.user = verifiedToken;
            next();
        } catch (err) {
            return res.status(statusCodes.Unauthorized).json({ success: false, message: "Forbidden: Invalid token", error: err.message });
        }
    }catch(err) {
        console.log("Error in authenticating user is: ", err);
        if (!res.headersSent) {
            return res.status(statusCodes.Unauthorized).json({
                success: false,
                msg: "Invalid or expired authentication token",
                error: err.message
            });
        }
    }
}