const zod = require("zod");
const Environment = require("../models/environmentModel");
const Compose = require("../models/composeModel");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");

const jsonBody = zod.object({
    content : zod.string().nonempty(),
    name : zod.string().nonempty(),
})

module.exports.saveEnvironment = async (req, res, next) => {
    const { content, name } = req.body;
    const { success } = jsonBody.safeParse(req.body);
    if(!success) throw new ExpressError("Invalid environment json string", statusCodes["Bad Request"], { error : "zod deemed invalid: saveEnvironment"});
    try {
        const env = await Environment.create({
            data : {
                value : content,
                name : name,
                user : { connect : { id : req.user.id } }
            },
            select : {
                name : true,
                userId: true,
                id: true,
            }
        })
        if(!env) throw new ExpressError("Error occured in DB during creation of env", statusCodes["Server Error"], { error: "Database error"});
        console.log(`saved env :\n`, env);
        return res.status(statusCodes.Ok).json({
            success : true,
            name: env.name,
            userId: env.userId,
            id: env.id,
        })
    } catch (err) {
        console.log("Error creating env is : ", err);
        next(err);
    }
}

/* json files saved format */
/*
const jsonFile = {
    name : debouncedName,
    content : {
        services : dockerfiles.services,
        compose : {
            name : "docker-compose",
            file : composeFile,
        }
    } 
}
*/

module.exports.saveCompose = async (req, res, next) => {
    const { content, name } = req.body;
    const { success } = jsonBody.safeParse(req.body);
    if(!success) throw new ExpressError("Invalid compose json string", statusCodes["Bad Request"], { error : "zod deemed invalid: saveCompose"});
    try {
        const compose = await Compose.create({
            data : {
                value : content,
                name : name,
                user : { connect : { id : req.user.id } }
            },
            select : {
                name: true,
                userId: true,
                id: true
            }
        });
        if(!compose) throw new ExpressError("Error occured in DB during creation of compose", statusCodes["Server Error"], { error: "Database error"});
        console.log(`saved compose:\n`, compose);
        return res.status(statusCodes.Ok).json({
            success : true,
            name: compose.name,
            userId: compose.userId,
            id : compose.id
        })
    }
    catch (err) {
        console.log("Error creating env is : ", err);
        next(err);
    }
}

const delBody = zod.object({
    delId : zod.string().nonempty(),
})

module.exports.deleteEnvironment = async (req, res, next) => {
    const { delId } = req.body;
    const { success } = delBody.safeParse(req.body);
    if(!success) throw new ExpressError("Invalid delId string", statusCodes["Bad Request"], { error : "zod deemed invalid: deleteEnvironment"});
    try {
        const deleteEnv = await Environment.delete({
            where : {
                id: delId,
            },
            select : {
                name : true,
                id: true,
            }
        });
        if(!deleteEnv) throw new ExpressError("Error occured in DB during deletion of environment", statusCodes["Server Error"], { error: "Database error"});
        console.log(`deleted environment:\n`, deleteEnv);
        return res.status(statusCodes.Ok).json({
            success : true,
            name: deleteEnv.name,
            id : deleteEnv.id
        })
    }
    catch (err) {
        console.log("Error deleting env is : ", err);
        next(err);
    }
}
