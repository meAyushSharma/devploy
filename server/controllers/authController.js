const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client, UserRefreshClient, auth } = require('google-auth-library');
const { PrismaClient } = require("@prisma/client");
const { checkUserExists, createUser } = require("../helper/authHelper");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");

const prisma = new PrismaClient();
const User = prisma.user;

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
  );

module.exports.registerUser = async (req, res, next) => {
    try{
        const { email, password, name, profile_pic } = req.body;
        if(!email || !password) throw new ExpressError("Signup Credentials not provided (┬┬﹏┬┬)", statusCodes["Bad Request"], {error:"Missing credentials"});

        const hashedPass = bcrypt.hashSync(password, 10);
        const { user, error, msg } = await createUser({authObj:false, email, password: hashedPass, name, profile_pic, User});

        if(error) throw new ExpressError(error.message, statusCodes["Server Error"]);
        console.log(`User created in DB:\n`, user);
        if(!user) throw new ExpressError(msg, statusCodes["Not Found"], {error: "User not found"});

        const jwtToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
        res.cookie("registerToken", jwtToken, { /* httpOnly:true, */ maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(201).json({ success: true, msg, redirect:"/" });

    }catch(err){
        console.log("Error during creation of user: ", err);
        next(err);
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) throw new ExpressError("Login Credentials not provided (┬┬﹏┬┬)", statusCodes["Bad Request"], {error:"Missing credentials"});

        const user = await checkUserExists({email, User});

        if(!user) throw new ExpressError("user login failed (┬┬﹏┬┬)", statusCodes["Not Found"], {redirect: "/signup", error: "User not exists"})
        console.log("this is user inside loginAuth: ", user);

        const passCheck = bcrypt.compareSync(password, user.password);
        if(!passCheck) throw new ExpressError("User Login failed (┬┬﹏┬┬)", statusCodes.Unauthorized, {error: "Wrong password/username"});
        
        const jwtToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
        res.cookie("registerToken", jwtToken, { /* httpOnly:true,*/ maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(201).json({ success: true, msg:"User loggedin successfully!", redirect:"/" });
    }

    catch(err){
        console.log("Error during login of user: ", err);
        next(err);
    }
}

module.exports.googleAuth = async (req, res, next) => {
    try{
        const { tokens } = await oAuth2Client.getToken(req.body.code);
        if(!tokens) throw new ExpressError("Google Auth token Missing", statusCodes["Bad Request"]);
        const authObj = jwt.decode(tokens.id_token);

        // 1. check if user exists
        const user = await checkUserExists({ email:authObj.email, User });
        console.log("This is user: ", user);

        // 2. if user exists => create tokens and set cookies => login
        if(user){
            console.log("user already exists: Login");
            const googleToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
            res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000 })
            res.cookie("googleToken", googleToken, { maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.status(201).json({ msg:`${user.email} loggedin successfully`, success:true, redirect:"/" })

        // 3. if user not exists => create new user, create tokens and set cookies => signup
        }else {
            const { user, error, msg } = await createUser({ authObj, email:null, password:null, name:null, profile_pic:null, User });

            if(error) throw new ExpressError(error.message, statusCodes["Server Error"], {error: "User not created, due to error"})
            if(!user) throw new ExpressError("User not created", statusCodes["Server Error"], {error:"Error during user creation"})

            const googleToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
            res.cookie("googleToken", googleToken, { maxAge : 7 * 24 * 60 * 60 * 1000 });
            res.cookie("isUserRegistered", "true", { maxAge : 7 * 24 * 60 * 60 * 1000 });
            return res.status(201).json({ success : true, msg, redirect:"/" });
        }
    }catch(err) {
        console.log("error during googleAuth is: ", err);
        next(err);
    }
}


// to refresh tokens, not in use currently
module.exports.refreshGoogleAuthToken = async (req, res, next) => {
    console.log(req.body);
    const user = new UserRefreshClient(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        req.body.refreshToken
      );
      const { credentials } = await user.refreshAccessToken();
      console.log("credential is: ",credentials);
      res.json(credentials);
}

