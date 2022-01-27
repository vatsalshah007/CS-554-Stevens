const mongoCollections = require('../config/mongoCollections')
let { ObjectId } = require('mongodb')
const user = mongoCollections.user
const bcrypt = require("bcrypt")

let saltRounds = 16


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

//// ERROR HANDLING ENDS

const create = async function create(name, username, password, cnfmPassword) {
    await createTypeCheck(name, username, password, cnfmPassword)

    username = username.toLowerCase()
    if (password != cnfmPassword) throw {code: 401, error: "Password does not match"}

    const userCollection = await user()

    hashedPassword = await bcrypt.hash(password, saltRounds) 

    let newUser = {
        _id: new ObjectId(),
        name: name,
        username: username,
        password: hashedPassword
    }

    let insertedUser = await userCollection.insertOne(newUser)
    if (insertedUser.insertedCount === 0) {
        throw {code: 500, error: `Unable to add the user to database.`}
    }

    insertedUser = await userCollection.findOne({_id: insertedUser.insertedId})
    if (!insertedUser) {
        throw {code: 404, error: `Cannot find the added user.`}
    }
    insertedUser._id = insertedUser._id.toString()

    return insertedUser
}

const login = async function login(username, password) {
    await loginTypeCheck(username, password)

    const userCollection = await user()

    username = username.toLowerCase()
    let findUser = await userCollection.findOne({username: username})
    if (!findUser) {
        throw {code: 401, error: `Username or Password entered is incorrect.`}
    }

    let passwordMatch = await bcrypt.compare(password, findUser.password)
    if (!passwordMatch) {
        throw {code: 401, error: `Username or Password entered is incorrect.`}
    }

    return JSON.parse(JSON.stringify(findUser))
}

module.exports = {
    create,
    login
}