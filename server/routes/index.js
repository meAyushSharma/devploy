const express = require("express");
const { get } = require("axios");
const router = express.Router();
const { userRouter } = require("./userRoutes");
const { dockerRouter } = require("./dockerRoutes");

router.use('/user', userRouter);
router.use('/docker', dockerRouter);
router.get('/search', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, async (req, res) => {
    const query = req.query.q;
    const requestFor = req.query.requestFor;
    let url="";
    if(requestFor === "docker") url = `https://hub.docker.com/v2/search/repositories/?query=${query}`; // 10 entries
    else if(requestFor === "gem") url = `https://rubygems.org/api/v1/search.json?query=${query}`; // 30 entries
    else if (requestFor === "npm") url = `https://registry.npmjs.org/-/v1/search?text=${query}&size=15`; // 15 entries
    else if (requestFor === "pip") url = `https://pypi.org/pypi/${query}/json`; // 1 entry
    else if (requestFor === "cargo") url = `https://crates.io/api/v1/crates?q=${query}`; // 30 entries
    console.log(`request for: ${requestFor} and query is: ${query}`);
    try {
        const response = await get(url);
        // console.log(response);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching data from Docker Hub' });
    }
})

module.exports = { router };