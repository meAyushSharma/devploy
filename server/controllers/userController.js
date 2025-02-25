const zod = require("zod");
const Environment = require("../models/environmentModel");
const Compose = require("../models/composeModel");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");
const User = require("../models/userModel");
const docker = require("../utils/dockerInstance");

const jsonBody = zod.object({
    content : zod.string().nonempty(),
    name : zod.string().nonempty(),
})

module.exports.saveEnvironment = async (req, res, next) => {
    const { content, name } = req.body;
    const { success } = jsonBody.safeParse(req.body);
    if(!success) return next(new ExpressError("Invalid environment json string", statusCodes["Bad Request"], { error : "zod deemed invalid: saveEnvironment"}));
    if(!req.user.id) return next(new ExpressError("Unauthorized Access Denied", statusCodes.Unauthorized, { error : "req.user.id not found"}));
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
        if(!env) return next(new ExpressError("Error occured in DB during creation of env", statusCodes["Server Error"], { error: "Database error"}));
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
    if(!success) return next(new ExpressError("Invalid compose json string", statusCodes["Bad Request"], { error : "zod deemed invalid: saveCompose"}));
    if(!req.user.id) return next(new ExpressError("Unauthorized Access Denied", statusCodes.Unauthorized, { error : "req.user.id not found"}));
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
        if(!compose) return next(new ExpressError("Error occured in DB during creation of compose", statusCodes["Server Error"], { error: "Database error"}));
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
    delId : zod.number().gt(0),
})

module.exports.deleteEnvironment = async (req, res, next) => {
    const { delId } = req.body;
    const { success } = delBody.safeParse(req.body);
    if(!success) return next(new ExpressError("Invalid delId string", statusCodes["Bad Request"], { error : "zod deemed invalid: deleteEnvironment"}));
    try {
        const deleteEnv = await Environment.delete({
            where : {
                id: delId,
            },
            select : {
                name : true,
                id: true,
                images : {
                    select : {
                        dockerId : true,
                        name: true,
                        container : {
                            select : {
                                dockerId : true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        if(!deleteEnv) return next(new ExpressError("Error occured in DB during deletion of environment", statusCodes["Server Error"], { error: "Database error"}));
        try {
            for (const image of deleteEnv.images) {
                for (const cont of image.container) {
                    const container = docker.getContainer(cont.dockerId);
                    const inspectData = await container.inspect();
                    if (inspectData.State.Running) {
                        await container.stop();
                        console.log(`Container ${cont.name} stopped successfully upon env deletion`);
                    }
                    await container.remove({ force: true });
                    console.log(`Container ${cont.name} removed from docker as well successfully upon env deletion`);
                }
                const removableImage = docker.getImage(image.dockerId);
                console.log("Time: ", (await removableImage.inspect()).Created);
                await removableImage.remove({ force: true });
                console.log(`Image: ${image.name} removed from docker as well successfully`);
            }
        } catch (dockerErr) {
            console.log(`Error deleting docker images and containers while deleting env is: `, dockerErr.message);
        }
        
        console.log(`deleted environment:\n`, deleteEnv);
        return res.status(statusCodes.Ok).json({
            success : true,
            name: deleteEnv.name,
            id : deleteEnv.id,
            msg : "Successfully deleted Environment file from Database"
        })
    }
    catch (err) {
        console.log("Error deleting env is : ", err);
        next(err);
    }
}

module.exports.deleteCompose = async (req, res, next) => {
    const { delId } = req.body;
    const { success } = delBody.safeParse(req.body);
    if(!success) return next(new ExpressError("Invalid delId string", statusCodes["Bad Request"], { error : "zod deemed invalid: deleteCompose"}));
    try {
        const deleteCompose = await Compose.delete({
            where : {
                id: delId,
            },
            select : {
                name : true,
                id: true,
            }
        });
        if(!deleteCompose) return next(new ExpressError("Error occured in DB during deletion of compose folder", statusCodes["Server Error"], { error: "Database error"}));
        console.log(`deleted compose folder:\n`, deleteCompose);
        return res.status(statusCodes.Ok).json({
            success : true,
            name: deleteCompose.name,
            id : deleteCompose.id,
            msg : "Successfully deleted compose folder from Database"
        })
    }
    catch (err) {
        console.log("Error deleting compose is : ", err);
        next(err);
    }
}

module.exports.getUserData = async (req, res, next) => {
    if(!req.user.id) return next(new ExpressError("Unauthorized Access Denied", statusCodes.Unauthorized, { error : "req.user.id not found"}));
    try {
        const envWithCompose = await User.findUnique({
            relationLoadStrategy : "join",
            where : { id : req.user.id, },
            select : {
                environments : {
                    select : {
                        id : true,
                        value : true,
                        name : true,
                    }
                },
                composes : {
                    select : {
                        id : true,
                        name : true,
                        value : true,
                    }
                },
                email : true,
                id : true,
            },
        })
        if(!envWithCompose) return next(new ExpressError("EnvWithCompose not found", statusCodes["Not Found"], { error : "EnvWithCompose null/Not found"}))
        console.log(envWithCompose);
        
        return res.status(statusCodes.Ok).json({
            success : true,
            userId : envWithCompose.id,
            files : {
                environments : envWithCompose.environments,
                composes : envWithCompose.composes
            }
        });
    } catch (err) {
        console.log("Error in envWithCompose");
        next(err);
    }
}
