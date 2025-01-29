const { get } = require("axios");
const ExpressError = require("../utils/ExpressError");

module.exports.registrySearchController = async (req, res, next) => {
    const query = req.query.q;
    if(!q) throw new ExpressError("No query provided", 400);
    try{
        const requestFor = req.query.requestFor;
        let url="";
        if(requestFor === "docker") url = `https://hub.docker.com/v2/search/repositories/?query=${query}`; // 10 entries
        else if(requestFor === "gem") url = `https://rubygems.org/api/v1/search.json?query=${query}`; // 30 entries
        else if (requestFor === "npm") url = `https://registry.npmjs.org/-/v1/search?text=${query}&size=15`; // 15 entries
        else if (requestFor === "pip") url = `https://pypi.org/pypi/${query}/json`; // 1 entry
        else if (requestFor === "cargo") url = `https://crates.io/api/v1/crates?q=${query}`; // 30 entries
        console.log(`request for: ${requestFor} and query is: ${query}`);
        const response = await get(url);
        return res.json(response.data);
    } catch (error) {
        console.error(`Error in fetching registry data:\n`, error);
        next(err);
    }
}