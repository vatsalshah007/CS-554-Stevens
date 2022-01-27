const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const {users, blogs, comments} = require("../data")



//// ERROR HANDLING STARTS

const createTypeCheck = async (name, username, password, cnfmPassword) => {
    if (!username || !password || !name || !cnfmPassword) throw { code: 401, error: `Signup fields cannot be empty`}
    
    if (typeof name !== "string" || typeof username !== "string" || typeof password !== "string" || typeof cnfmPassword !== "string") {
        throw {code: 401, error: `Signup fields need to be a string`}
    }
    if (name.trim().length === 0 || username.trim().length === 0 || password.trim().length === 0 || cnfmPassword.trim().length === 0) {
        throw {code: 401, error: `Signup fields cannot be empty spaces`}        
    }
    
    let myUsername = username.split(" ")
    if (myUsername.length > 1) throw  { code: 401, error: `Username cannot have spaces`}
    if (/[^\w\s]/.test(username)) throw  { code: 401, error: `Username can only be alphanumeric characters`}
    if (username.length < 4) throw { code: 401, error: `Username must be at least 4 characters long`}

    if (/[^\w\s]/.test(name)) throw  { code: 401, error: `name can only be alphanumeric characters`}
    if (name.length < 4) throw { code: 401, error: `name must be at least 4 characters long`}

    let myPassword = password.split(" ")
    if (myPassword.length > 1) throw  { code: 401, error: `Password cannot have spaces`}
    if (password.length < 6) throw { code: 401, error: `Password must be at least 6 characters long`}

    let myCnfmPassword = cnfmPassword.split(" ")
    if (myCnfmPassword.length > 1) throw  { code: 401, error: `Confirm Password cannot have spaces`}
    if (cnfmPassword.length < 6) throw { code: 401, error: `Confirm Password must be at least 6 characters long`}
}

const loginTypeCheck = async (username, password) => {
    if (!username || !password ) throw { code: 401, error: `Username or Password cannot be empty`}
    
    if (typeof username !== "string" || typeof password !== "string" ) {
        throw {code: 401, error: `Login fields need to be a string`}
    }
    if (username.trim().length === 0 || password.trim().length === 0) {
        throw {code: 401, error: `Login fields cannot be empty spaces`}        
    }
    
    let myUsername = username.split(" ")
    if (myUsername.length > 1) throw  { code: 401, error: `Username cannot have spaces`}
    if (/[^\w\s]/.test(username)) throw  { code: 401, error: `Username can only be alphanumeric characters`}
    if (username.length < 4) throw { code: 401, error: `Username must be at least 4 characters long`}

    let myPassword = password.split(" ")
    if (myPassword.length > 1) throw  { code: 401, error: `Password cannot have spaces`}
    if (password.length < 6) throw { code: 401, error: `Password must be at least 6 characters long`}
}

const errorCheckingComment = async (comment) => {
    if (!comment) throw { code: 401, error: `Comment cannot be empty`}
    
    if (typeof comment !== "string") {
        throw {code: 401, error: `Comment need to be a string`}
    }
    if (comment.trim().length === 0) {
        throw {code: 401, error: `Comment cannot be empty spaces`}        
    }
}

const idCheck = async (id) => {
    if (!id) {
        throw {code: 401, error: `Id field cannot be empty`}
    }
    if (typeof id !== "string") {
        throw {code: 401, error: `Id needs to be a string`}
    } else if (id.trim().length === 0) {
        throw {code: 401, error: `Id cannot be empty spaces`}
    }
    if (!ObjectId.isValid(id)) {
        throw {code: 401, error: `Please provide a valid ObjectId`}
    }
}

const duplicateQueryCheck = async (queryValue) => {
    if (Array.isArray(queryValue)) {
        throw {code: 401, error: `Cannot have the same key twice`}
    }
}

const negativeValueCheck = async (value) => {
    if (value < 0) {
        throw {code: 401, error: `Query cannor have negative values`}
    }
}

const blogCreateTypeCheck = async (title, body, username) => {
    if (!title || !username || !body) {
        throw {code: 401, error: `Signup fields cannot be null/ undefined`}        
    }
    if (typeof title !== "string" || typeof username !== "string" || typeof body !== "string") {
        throw {code: 401, error: `Signup fields need to be a string`}
    }
    if (title.trim().length === 0 || username.trim().length === 0 || body.trim().length === 0) {
        throw {code: 401, error: `Signup fields cannot be empty spaces`}        
    }
}

const putUpdateCheck = async (title, body) => {
    if (!title || !body) throw {code: 401, error: `You need to provide both title and body`}
    if (typeof title !== "string" || typeof body !== "string") throw { code: 401,  error: `Both Title and Body needs to be strings`}
    if (title.trim().length == 0 || body.trim().length == 0) throw { code: 401, error: `Title and body cannot be empty spaces`}
}

const patchUpdateCheck = async (title, body) => {
    if (!title && !body) throw {code: 401, error: `You need to provide both title and body`}
    if (title) {
        if (typeof title !== "string") throw { code: 401,  error: `Title needs to be string`}
        if (title.trim().length == 0 ) throw {code: 401, error: `Title cannot be empty spaces`}
    }
    if(body){
        if (typeof body !== "string") throw { code: 401,  error: `Body needs to be string`}
        if (body.trim().length == 0) throw { code: 401, error: `Body cannot be empty spaces`}    
    }
}
//// ERROR HANDLING ENDS


router.get("/", async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            if (Object.keys(req.query).length > 2) {
                throw {code: 401, error: `Cannot have more than 2 queries at a time`}

            } else if (Object.keys(req.query).length == 2) {
                await negativeValueCheck(Number(req.query.skip))
                await negativeValueCheck(Number(req.query.take))

            } else if (req.query.skip) {
                await duplicateQueryCheck(req.query.skip)
                await negativeValueCheck(Number(req.query.skip))

            } else if (req.query.take) {
                await duplicateQueryCheck(req.query.take)
                await negativeValueCheck(Number(req.query.take))

                if (req.query.take > 100) {
                    throw {code: 401, error: `Please provide a value between 0 and 100 for the take query`}
                }
            } else {
                throw {code: 401, error: `Query string needs to be skip or take only`}
            }  
        }    
    
        let getNBlogs = await blogs.get(req.query)
        return res.json(getNBlogs)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})

router.post("/signup", async (req, res) => {
    let { name, username, password, cnfmPassword } = req.body

    try {
        if (req.session.loggedInUser) {
            throw res.status(403).json({error: `already LoggedIn`})
        }

        await createTypeCheck(name, username, password, cnfmPassword)
        let insertUser = await users.create(name, username, password, cnfmPassword)
        return res.json(insertUser)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})

router.post("/login", async (req, res) => {
    let { username, password } = req.body

    try {
        if (req.session.loggedInUser) {
            throw res.status(403).json({error: `already LoggedIn`})
        }

        await loginTypeCheck(username, password)
        let loginUser = await users.login(username, password)
        req.session.loggedInUser = {
            _id: ObjectId(loginUser._id),
            username: loginUser.username
        }
        return res.json(loginUser)
    } catch (e) {
        if (e.code) {
            return res.status(e.code).json(e.error)   
        } else {
            return res.status(500).json(e)
        }
    }
})

router.get("/logout", async (req, res) => {
    if (req.session.loggedInUser) {
        req.session.destroy()
        return res.json("Successfully Logged out")
    }else{
        return res.status(403).json("Forbidden")
    }
})

router.get("/:id", async (req, res) => {
    try {
        await idCheck(req.params.id)

        let blogWithId = await blogs.getById(req.params.id)
        return res.json(blogWithId)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})

router.post("/", async (req, res) => {
    let { title, body } = req.body
    try {
        await blogCreateTypeCheck( title, body, req.session.loggedInUser.username)

        let insertBlog = await blogs.create(title, body, req.session.loggedInUser._id, req.session.loggedInUser.username)
        return res.json(insertBlog)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})

router.post("/:id/comments", async (req, res) => {
    let comment = req.body.comment
    try {
        await idCheck(req.params.id)
        await errorCheckingComment(comment)

        let addComment = await comments.addComment(comment, req.params.id, req.session.loggedInUser._id, req.session.loggedInUser.username)
        return res.json(addComment)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }        
    }
})

router.delete("/:blogId/:commentId", async (req, res) => {
    try {
        await idCheck(req.params.blogId)
        await idCheck(req.params.commentId)

        let addComment = await comments.deleteComment(req.params.commentId, req.params.blogId, req.session.loggedInUser._id)
        return res.json(addComment)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }        
    }
})

router.put("/:id", async (req, res) => {
    let { title, body } = req.body
    try {
        await idCheck(req.params.id)
        await putUpdateCheck(title, body)

        let putBlog = await blogs.put(req.params.id, title, body, req.session.loggedInUser._id)
        return res.json(putBlog)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})


router.patch("/:id", async (req, res) => {
    let { title, body } = req.body
    try {
        await idCheck(req.params.id)
        await patchUpdateCheck(title, body)

        let patchBlog = await blogs.patch(req.params.id, title, body, req.session.loggedInUser._id)
        return res.json(patchBlog)
    } catch (e) {
        if (e.code) {
            res.status(e.code).json(e.error)   
        } else {
            res.status(500).json(e)
        }
    }
})


module.exports = router