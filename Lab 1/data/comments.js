const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const blogs = mongoCollections.blog
const usersData = require("./users")


//// ERROR HANDLING STARTS
const errorChecking = async (comment) => {
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
//// ERROR HANDLING ENDS

const addComment = async function addComment(comment, blogId, userID, username) {
    await errorChecking(comment)
    await idCheck(blogId)
    
    const blogCollection = await blogs()
    
    let blogInDB = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogInDB) {
        throw {code: 404, error: `Blog not found with the provided ID.`}        
    }

    let commentData = {
        _id: new ObjectId(),
        userThatPostedComment: {_id: userID, username: username},
        comment: comment.trim()
    }

    let commentAdded = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$addToSet: {comments: commentData}})
    if (commentAdded.modifiedCount === 0) {
        throw {code: 500, error: `Unable to add comment to the blog with ID ${blogId}`}
    }

    blogInDB = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogInDB) {
        throw {code: 404, error: `Blog not found with the provided ID.`}        
    }
    
    blogInDB._id = blogInDB._id.toString()
    blogInDB.userThatPosted._id = blogInDB.userThatPosted._id.toString()

    blogInDB.comments.forEach( x => {
        x._id = x._id.toString()
        x.userThatPostedComment._id = x.userThatPostedComment._id.toString()    
    });

    return blogInDB
}

const deleteComment = async function deleteComment(commentId, blogId, userID) {
    await idCheck(blogId)
    await idCheck(commentId)
    
    const blogCollection = await blogs()

    let blogInDB = await blogCollection.findOne({_id: ObjectId(blogId)})
    if (!blogInDB) {
        throw {code: 404, error: `Blog not found with the provided ID.`}        
    }
    let deleted = false, deletedResult
    for (const x of blogInDB.comments) {
        if (x._id.toString() === commentId) {
            if (x.userThatPostedComment._id === userID) {
                let deletedComment = await blogCollection.updateOne({_id: ObjectId(blogId)}, {$pull: {comments: {_id: ObjectId(commentId)}}})
                if (deletedComment.modifiedCount === 0) {
                    throw {code: 500, error:`Unable to delete comment with commentId: ${commentId} for blog with blogId: ${blogId}`}
                }
                deleted = true
                deletedResult = {
                    commentId: commentId, 
                    deleted: deleted
                }
            } else {
                throw {code: 403, error: `You are not authorized to delete this comment`}
            }
        }
    }
    if (deleted === false) {
        throw {code: 404, error: `Comment not found with the ID provided`}
    }
    return deletedResult
}

module.exports = {
    addComment,
    deleteComment
}