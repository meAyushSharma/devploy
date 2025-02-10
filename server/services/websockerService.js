const jwt = require("jsonwebtoken");
const url = require("url");
const statusCodes = require("../utils/statusCodes");

module.exports.webSocketConnectionOn = async (wsConnection, req) => {
    const { token, contId } = url.parse(req.url, true).query;
    if(!token){
        wsConnection.close(statusCodes["Ws Unauthorized"], () => {
            wsConnection.send("Unauthorized User Access Denied : No token found")
        });
    }
    if(!contId) {
        wsConnection.close(statusCodes["Ws Forbidden"], () => {
            wsConnection.send("Missing credential : contId not found")
        });
    }
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
    }catch (err) {

    }
}




