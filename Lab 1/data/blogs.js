const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const blogs = mongoCollections.blog
const usersData = require("./users")



//// ERROR HANDLING STARTS

const blogCreateTypeCheck = async (title, body) => {
    if (!title || !body) {
        throw {code: 401, error: `Fields values cannot be null/ undefined`}        
    }
    if (typeof title !== "string" || typeof body !== "string") {
        throw {code: 401, error: `Fields values need to be a string`}
    }
    if (title.trim().length === 0 || body.trim().length === 0) {
        throw {code: 401, error: `Fields values cannot be empty spaces`}        
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

const create = async function create(title, body, userID, username) {
    await blogCreateTypeCheck(title, body, username)

    const blogCollection = await blogs()

    let newBlog = {
        _id: new ObjectId(),
        title: title.trim(),
        body: body.trim(),
        userThatPosted: {_id: userID, username: username},
        comments: []
    }

    let insertedBlog = await blogCollection.insertOne(newBlog)
    if (insertedBlog.insertedCount === 0) {
        throw {code: 500, message: `Unable to add blog to the database`}
    }

    insertedBlog = await blogCollection.findOne({_id: insertedBlog.insertedId})
    if (insertedBlog.insertedCount === 0) {
        throw {code: 404, message: `Unable to find the added blog`}
    }

    insertedBlog._id = insertedBlog._id.toString()
    insertedBlog.userThatPosted._id = insertedBlog.userThatPosted._id.toString()

    return insertedBlog 
}

const get = async function get(queryString) {
    
    const blogCollection = await blogs()

    let getNBlogs
    if (Object.keys(queryString).length > 0) {
        if (Object.keys(queryString).length == 2) {
            await negativeValueCheck(Number(queryString.skip))
            await negativeValueCheck(Number(queryString.take))

            getNBlogs = await blogCollection.find({}).skip(Number(queryString.skip)).limit(Number(queryString.take)).toArray()
            if (!getNBlogs) {
                throw {code: 500, error: `Internal server error`}
            }
        } else if (queryString.skip) {
            await duplicateQueryCheck(queryString.skip)
            await negativeValueCheck(Number(queryString.skip))

            getNBlogs = await blogCollection.find({}).skip(Number(queryString.skip)).limit(20).toArray()
            if (!getNBlogs) {
                throw {code: 500, error: `Internal server error`}
            }
        } else if (queryString.take) {
            await duplicateQueryCheck(queryString.take)
            await negativeValueCheck(Number(queryString.take))
            if (queryString.take > 100) {
                throw {code: 401, error: `Please provide a value between 0 and 100 for the take query`}
            }

            getNBlogs = await blogCollection.find({}).limit(Number(queryString.take)).toArray()
            if (!getNBlogs) {
                throw {code: 500, error: `Internal server error`}
            } 
        } else {
            throw {code: 401, error: `Query string needs to be skip or take only`}
        }     
    } 
    if (Object.keys(queryString).length == 0) {
        
        getNBlogs = await blogCollection.find({}).limit(20).toArray() 
        if (!getNBlogs) {
            throw {code: 500, error: `Internal server error`}
        }   
    }

    return  JSON.parse(JSON.stringify(getNBlogs))

}

const getById = async function getById(blogId) {
    await idCheck(blogId)

    const blogCollection = await blogs()

    let blogWithId = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogWithId) {
        throw {code: 404, error: `Unable to find the blog with Id: ${blogId}`}
    }

    return JSON.parse(JSON.stringify(blogWithId))
}

const put = async function put(blogId, title, body, userId) {
    await idCheck(blogId)
    await putUpdateCheck(title, body)
    
    const blogCollection = await blogs()

    let blogWithId = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogWithId) {
        throw {code: 404, error: `Unable to find the blog with Id: ${blogId}`}
    }

    if (blogWithId.userThatPosted._id != userId) {
        throw {code: 403, error: `You do not have access to edit this blog`}
    }

    if (title === blogWithId.title && body === blogWithId.body) {
        throw {code: 400, error: `Please make changes in order to update`}
    }

    let updatedBlog = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$set: {title: title.trim(), body: body.trim()}})
    if (updatedBlog.modifiedCount == 0) {
        throw {code: 500, error: `Internal Server Error.`}
    }

    return await getById(blogId)
}


const patch = async function patch(blogId, title, body, userId) {
    await idCheck(blogId)
    await patchUpdateCheck(title, body)
    
    const blogCollection = await blogs()
    let updatedBlog

    let blogWithId = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogWithId) {
        throw {code: 404, error: `Unable to find the blog with Id: ${blogId}`}
    }

    if (blogWithId.userThatPosted._id != userId) {
        throw {code: 403, error: `You do not have access to edit this blog`}
    }
    
    if (title && body) {
        if ((title === blogWithId.title) && (body === blogWithId.body)) {
            throw {code: 400, error: `Please make changes in order to update`}   
        }
        updatedBlog = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$set: {title: title.trim(), body: body.trim()}})
    } else if (title && !body) {
        if (title === blogWithId.title) {
            throw {code: 400, error: `Please make changes in order to update`}   
        } 
        updatedBlog = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$set: {title: title}})
    } else if (body && !title) {
        if (body === blogWithId.body) {
            throw {code: 400, error: `Please make changes in order to update`}   
        }
        updatedBlog = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$set: {body: body}})
    }
    
    if (updatedBlog.modifiedCount == 0) {
        throw {code: 500, error: `Internal Server Error.`}
    }

    return await getById(blogId)
}


module.exports = {
    create,
    get,
    getById,
    put,
    patch
}