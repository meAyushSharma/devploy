const express = require("express");
const axios = require("axios");
const router = express.Router();
const {userRouter} = require("./userRoutes");
const {dockerRouter} = require("./dockerRoutes");

router.use('/user', userRouter);
router.use('/docker', dockerRouter);
router.get('/search', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, async (req, res) => {
    const query = req.query.q;
    console.log("query is:", query);
    try {
        const response = await axios.get(`https://hub.docker.com/v2/search/repositories/?query=${query}`);
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching data from Docker Hub' });
    }
})

module.exports = { router };