const axios = require("axios");
const ExpressError = require("../utils/ExpressError");
const statusCodes = require("../utils/statusCodes");
const https = require("https");

// Create an agent forcing IPv4
const agent = new https.Agent({
    family: 4,          // Force IPv4
    keepAlive: true,    // Optionally keep connections alive
});

module.exports.registrySearchController = async (req, res, next) => {
    try{
        const query = req.query.q;
        const requestFor = req.query.requestFor;
        if(!query || !requestFor) return next(new ExpressError("No query || requestFor provided", statusCodes["Bad Request"], {error :"no query/requestFor parameter provided"}))
        let url="";
        if(requestFor === "docker") url = `https://hub.docker.com/v2/search/repositories/?query=${query}`; // 10 entries
        else if(requestFor === "gem") url = `https://rubygems.org/api/v1/search.json?query=${query}`; // 30 entries
        else if (requestFor === "npm") url = `https://registry.npmjs.org/-/v1/search?text=${query}&size=15`; // 15 entries
        else if (requestFor === "pip") url = `https://pypi.org/pypi/${query}/json`; // 1 entry
        else if (requestFor === "cargo") url = `https://crates.io/api/v1/crates?q=${query}`; // 30 entries
        console.log(`request for: ${requestFor} and query is: ${query}`);
        console.log("Request URL :", url);
        const response = await axios.get(url, { httpsAgent: agent, timeout: 30000 });
        if(!response?.data) return next(new ExpressError("No library found", statusCodes["Not Found"], { error: "Docker Hub API returned empty results" }));
        return res.status(statusCodes.Ok).json(response.data);
    } catch (error) {
        console.error(`Error in fetching registry data:\n`, error.message);
        next(new ExpressError("Failed to fetch registry data from Docker Hub", statusCodes["Server Error"], { error: error.message }));
    }
}

module.exports.tagSearchRegistry = async (req, res, next) => {
    try{
        const library = req.query.library;
        const page = req.query.page;
        // console.log("this is library: ", library);
        if(!library) return next(new ExpressError("No library provided", statusCodes["Bad Request"], { error: "No library parameter provided" }));
        const response = await axios.get(`https://hub.docker.com/v2/repositories/library/${library}/tags?page=${page||1}&page_size=100`, { httpsAgent: agent, timeout: 10000 });
        if (!response.data || !response.data.results) {
            return next(new ExpressError("No tags found", statusCodes["Not Found"], { error: "Docker Hub API returned empty results" }));
        }
        const tags = response.data.results.map(tag => tag.name);
        res.status(statusCodes.Ok).json({
            msg: "Found these tags",
            success : true,
            tagNames: {
                tags,
                next: response.data.next,
                prev: response.data.previous,
            }
        })
    }
    catch (err) {
        console.error(`Error in fetching tags data:`, err.message);
        return next(new ExpressError("Failed to fetch tags from Docker Hub", statusCodes["Server Error"], { error: err.message }));
    }
}