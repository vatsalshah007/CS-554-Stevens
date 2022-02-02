const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const { getById } = require("../data/getById");



(async () => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
})();

const idCheck = async (id) => {
    if(!id) throw {code: 401, error: `ID cannot be null or undefined`}
    if(!Number(id)) throw {code: 401, error: `ID not a number`}
}


router.get("/history", async (req, res) => {
    try {
        let visitorList = []
        let userExistsInCache = await client.lRange("visitorList", 0, 19)
        if (userExistsInCache.length > 0) {
            for(i in userExistsInCache){
                let users = await client.hGet("usersList", userExistsInCache[i])
                visitorList.push(JSON.parse(users))
            }
            res.json(visitorList)
        } else {
            res.json(visitorList)
        }   
    } catch (e) {
        if (e.code) {
            return res.status(e.code).json(e.error)
        } else {
            return res.json(e)
        }
    }
})

router.get("/:id", async (req, res) => {
    let id = req.params.id.trim()
    
    try {
        await idCheck(id)
        let userExistsInCache = await client.hExists("usersList", id) 
        if (userExistsInCache) {
            let user = await client.hGet("usersList", id)
            await client.lPush("visitorList", id)
            res.json(JSON.parse(user))
        } else {
            let getUser = await getById(id)
            await client.hSet("usersList", id, JSON.stringify(getUser))
            await client.lPush("visitorList", id)
            res.json(getUser)
        }
    } catch (e) {
        if (e.code) {
            return res.status(e.code).json(e.error)
        } else {
            return res.json(e)
        }
    }
})


module.exports = router