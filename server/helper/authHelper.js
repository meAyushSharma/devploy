module.exports.checkUserExists = async ({email, User}) => {
    try {
        const user = await User.findUnique({
            where: { email },
            select:{
                id:true,
                email:true,
                google_id:true,
                is_google_user:true,
                name:true,
                profile_pic:true,
                password:true,
            }
        });
        return user;
    }catch(err) {
        console.log("Error during userExistsCheck is: ", err);
        return null;
    }
}

module.exports.createUser = async ({authObj, email, password, name, profile_pic, User}) => {
    try{
        // 1. if google signup
        if(authObj){
            const user = await User.create({
                data:{
                    email:authObj.email,
                    google_id:authObj.sub,
                    name:authObj.name,
                    profile_pic:authObj.picture,
                    is_google_user:true,
                },
                select:{
                    id:true,
                    email:true,
                    google_id:true,
                    name:true,
                    profile_pic:true,
                    is_google_user:true,
                    google_id:true,
                }
            });
            return { user, error:null, msg:"User Signin Successfully （￣︶￣）↗　" };
        }
        // 2. if normal signup 
        else{
            console.log(email);
            const user = await User.create({
                data:{ email, password, name, profile_pic },
                select:{
                    id:true,
                    email:true,
                    password:true,
                    name:true,
                    profile_pic:true,
                    is_google_user:true,
                    google_id:true,
                }
            });
            return { user, error:null, msg:"User Signin Successfully （￣︶￣）↗　" };
        }
    }catch (err) {
        console.log("The error during signup is: ", err);
        return { user:null, error:err, msg:"Error during signup" };
    }
}