const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { OAuth2Client, UserRefreshClient, auth } = require('google-auth-library');
const { checkUserExists, createUser } = require("../helper/authHelper");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");

const { User, MetaData } = require("../models/prismaClient");
const { sendMail } = require("../services/sendMail");
const { getVerifyEmailTemplate, getForgotPasswordTemplate } = require("../helper/resendHelper");

const DOMAIN_NAME = process.env.DOMAIN_NAME || ".devbox.localhost";
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
);

const registerBody = zod.object({
    email : zod.string().email().nonempty(),
    password : zod.string().min(8),
    name : zod.string(),
    profile_pic : zod.string().url(),
    code: zod.string().nonempty(),
})

module.exports.registerUser = async (req, res, next) => {
    try{
        const { email, password, name, profile_pic, code } = req.body;
        const { success, data } = registerBody.safeParse(req.body);
        if(!success) return next(new ExpressError("Invalid Signup Credentials ━┳━ ━┳━", statusCodes["Bad Request"], {error: "zod deemed invalid: signup creds"}))
        if(!email || !password || !code) return next(new ExpressError("Signup Credentials not provided (┬┬﹏┬┬)", statusCodes["Bad Request"], {error:"Missing credentials"}));

        // 1. checking if email verified
        const meta = await MetaData.findFirst({
            where: {
                email
            },
            select : {
                email: true,
                code : true,
                created_at : true,
            }
        });
        if(!meta) return next(new ExpressError("Couldn't find metadata for mail verification", statusCodes["Server Error"], { error: "Meta data for mail verification not found in db"}));
        const createdTime = new Date(meta.created_at);
        const currTime = new Date();
        try {
            if(Math.floor((currTime-createdTime)/60000) > 10){
                await MetaData.delete({ where: { email }});
                console.log(`Metadata for ${email} and code ${code} deleted successfully`);
                return next(new ExpressError("Code Expired", statusCodes.Forbidden, { error: "Mail verification code expired"}));
            } else {
                const valid = code === meta.code;
                await MetaData.delete({ where: { email }});
                console.log(`Metadata for ${email} and code ${code} deleted successfully`);
                if(!valid) return next(new ExpressError("Invalid mail verification code", statusCodes.Forbidden, { error: "Invalid/Incorrect verification code"}));
            }
        } catch (err) {
            return next(err);
        }

        // 2. check if user exist already
        const exists = await User.findUnique({
            where: { email: email, },
            select: { id: true, }
        });
        if(exists) return next(new ExpressError("User Already Exists", statusCodes.Forbidden, { error: "user already exists" }));

        // 3. proceed with user creation
        const hashedPass = bcrypt.hashSync(password, 10);
        const { user, error, msg } = await createUser({authObj:false, email, password: hashedPass, name, profile_pic, User});

        if(error) return next(new ExpressError(error.message, statusCodes["Server Error"], {error : "error is mentioned in msg"}));
        console.log(`User created in DB:\n`, user);
        if(!user) return next(new ExpressError(msg, statusCodes["Not Found"], {error: "User not found"}));

        const jwtToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
        res.cookie("registerToken", jwtToken, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME })
        res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME });
        return res.status(statusCodes.Ok).json({ success: true, msg });

    }catch(err){
        console.log("Error during creation of user: ", err);
        next(err);
    }
}

const loginBody = zod.object({
    email : zod.string().email().nonempty(),
    password : zod.string().min(8)
})

module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { success, data } = loginBody.safeParse(req.body);
        if(!success) return next(new ExpressError("Invalid Login credentials ━┳━ ━┳━", statusCodes["Bad Request"], {error: "zod deemed invalid: login creds"}))
        if(!email || !password) return next(new ExpressError("Login Credentials not provided (┬┬﹏┬┬)", statusCodes["Bad Request"], {error:"Missing credentials"}));

        const user = await checkUserExists({email, User});

        if(!user) return next(new ExpressError("User doesn't exist failed (┬┬﹏┬┬)", statusCodes["Not Found"], {error: "User not exists"}))
        console.log("User inside loginAuth: ", user);

        const passCheck = bcrypt.compareSync(password, user.password);
        if(!passCheck) return next(new ExpressError("Password not matched (┬┬﹏┬┬)", statusCodes.Unauthorized, {error: "Wrong password/username"}));
        
        const jwtToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
        res.cookie("registerToken", jwtToken, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME })
        res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME });

        return res.status(statusCodes.Ok).json({ success: true, msg:"User loggedin successfully!" });
    }

    catch(err){
        console.log("Error during login of user: ", err);
        next(err);
    }
}

module.exports.googleAuth = async (req, res, next) => {
    try{
        const { tokens } = await oAuth2Client.getToken(req.body.code);
        if(!tokens) return next(new ExpressError("Google Auth token Missing", statusCodes["Bad Request"], {error: "error mentioned in msg"}));
        const authObj = jwt.decode(tokens.id_token);

        // 1. check if user exists
        const user = await checkUserExists({ email:authObj.email, User });
        console.log("This is user: ", user);

        // 2. if user exists => create tokens and set cookies => login
        if(user){
            console.log("user already exists: Login");
            const googleToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
            res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME })
            res.cookie("googleToken", googleToken, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME })
            return res.status(statusCodes.Ok).json({ msg:`${user.email} loggedin successfully`, success:true })

        // 3. if user not exists => create new user, create tokens and set cookies => signup
        }else {
            const { user, error, msg } = await createUser({ authObj, email:null, password:null, name:null, profile_pic:null, User });

            if(error) return next(new ExpressError(error.message, statusCodes["Server Error"], {error: "User not created, due to error"}))
            if(!user) return next(new ExpressError("User not created", statusCodes["Server Error"], {error:"Error during user creation"}))

            const googleToken = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || "random-secret");
            res.cookie("googleToken", googleToken, { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME });
            res.cookie("isUserRegistered", "true", { maxAge: 7 * 24 * 60 * 60 * 1000, secure: true, sameSite: "None", httpOnly: false, path:"/", domain: DOMAIN_NAME });
            return res.status(statusCodes.Ok).json({ success : true, msg });
        }
    }catch(err) {
        console.log("error during googleAuth is: ", err);
        next(err);
    }
}

const emailBody = zod.object({
    email: zod.string().email().nonempty(),
})

module.exports.mailVerification = async (req, res, next) => {
    try {
        const {email} = req.body;
        const {success} = emailBody.safeParse(req.body);
        if(!success) return next(new ExpressError("Invalid Email ━┳━ ━┳━", statusCodes["Bad Request"], {error: "zod deemed invalid: mail verification"}));
        const code = Math.floor(Math.random()*10000000);
        const meta = await MetaData.create({
            data :{
                email: email,
                code: `${code}`
            },
            select : {
                email:true,
                code: true,
            }
        });
        if(!meta) return next(new ExpressError("Meta Data not created", statusCodes["Server Error"], {error:"Error during mail verification"}));
        const { data, error } = await sendMail({
            to: email,
            ...getVerifyEmailTemplate(code)
        });
        if (error) {
            console.log('Error sending email:', error);
            return next(new ExpressError("Error sending code", statusCodes["Server Error"], { error: "Some error during sending code via mail" }))
        }
        console.log(`Successfully sent email verification mail for signup at: ${data.id}`);
        return res.status(statusCodes.Ok).json({ msg: "Email verification sent successfully", success: true });
    } catch (err) {
        console.log("error during mailVerification for signup is: ", err);
        return next(err);
    }
}


module.exports.verifyEmailForgotPass = async (req, res, next) => {
    try {
        const {email} = req.body;
        const {success} = emailBody.safeParse(req.body);
        if(!success) return next(new ExpressError("Invalid Email ━┳━ ━┳━", statusCodes["Bad Request"], {error: "zod deemed invalid: mail verification for forgot password"}));
        const code = Math.floor(Math.random()*10000000);
        const meta = await MetaData.create({
            data :{
                email: email,
                code: `${code}`
            },
            select : {
                email:true,
                code: true,
            }
        });
        if(!meta) return next(new ExpressError("Meta Data not created", statusCodes["Server Error"], {error:"Error during mail verification forgot password"}));
        const { data, error } = await sendMail({
            to: email,
            ...getForgotPasswordTemplate(code)
        });
        if (error) {
            console.log('Error sending email:', error);
            return next(new ExpressError("Error sending code", statusCodes["Server Error"], { error: "Some error during sending code via mail for forgot password" }))
        }
        console.log(`Successfully sent email verification mail for forgot password at: ${data.id}`);
        return res.status(statusCodes.Ok).json({ msg: "Email verification sent successfully", success: true });
    } catch (err) {
        console.log("error during verifyEmailForgotPass is: ", err);
        return next(err);
    }
}

const forgotPassBody = zod.object({
    email: zod.string().email().nonempty(),
    password: zod.string().min(8),
    code: zod.string().nonempty(),
});

module.exports.forgotPasswordReset = async (req, res, next) => {
    try {
        const { email, password, code } = req.body;
        const { success, data } = forgotPassBody.safeParse(req.body);
        if(!success) return next(new ExpressError("Invalid forgot password Credentials ━┳━ ━┳━", statusCodes["Bad Request"], {error: "zod deemed invalid: forgotPasswordReset"}))
        if(!email || !password || !code) return next(new ExpressError("Forgot password Credentials not provided (┬┬﹏┬┬)", statusCodes["Bad Request"], {error:"Missing credentials"}));

        // 1. checking if email verified
        const meta = await MetaData.findFirst({
            where: {
                email,
            },
            select : {
                email: true,
                code : true,
                created_at : true,
            }
        });
        if(!meta) return next(new ExpressError("Couldn't find metadata for mail verification", statusCodes["Server Error"], { error: "Meta data for mail verification for FORGOT PASSWORD request not found in db"}));
        const createdTime = new Date(meta.created_at);
        const currTime = new Date();
        try {
            if(Math.floor((currTime-createdTime)/60000) > 10){
                await MetaData.delete({ where: { email }});
                console.log(`Metadata for ${email} and code ${code} deleted successfully`);
                return next(new ExpressError("Code Expired", statusCodes.Forbidden, { error: "Mail verification code for forgot password request expired"}));
            } else {
                const valid = code === meta.code;
                await MetaData.delete({ where: { email }});
                console.log(`Metadata for ${email} and code ${code} deleted successfully`);
                if(!valid) return next(new ExpressError("Invalid mail verification code for forgot password request", statusCodes.Forbidden, { error: "Invalid/Incorrect verification code for forgot password request"}));
            }
        } catch (err) {
            return next(err);
        }
        const hashedPass = bcrypt.hashSync(password, 10);
        const user = await User.update({
            where: {
                email,
            },
            data: {
                password: hashedPass
            },
            select: {
                name: true,
                email: true,
                id: true,
            }
        });
        if(!user) return next(new ExpressError("Error during password reset request for forgot password of user", statusCodes["Not Found"], { error: "User not found"}));
        console.log("Successfully resetted password for email: ", email);
        return res.status(statusCodes.Ok).json({
            success: true,
            msg: `Your password changed successfully (づ￣ 3￣)づ`,
        });
    } catch (err) {
        console.log("error during forgotPasswordReset is: ", err);
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
      console.log("credential is: ", credentials);
      res.json(credentials);
}

