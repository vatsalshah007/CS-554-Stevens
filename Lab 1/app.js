const express = require("express")
const app = express();
const configRoutes = require("./routes")
const session = require("express-session")
const { blogs } = require("./data/index")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    session({
        name: "AuthCookie",
        secret: "some secret string",
        resave: false,
        saveUninitialized: true
    })
)

// MIDDLEWARE STARTS

app.use("/blog/:id/comment", (req, res, next) => {
  if (req.method == "POST") {
    if (!req.session.loggedInUser) {
      return res.status(403).json("Forbidden")  
    }
  }
  next()
})


app.use("/blog/:blogId/:commentId", async (req, res, next) => {
  if (req.method == "DELETE") {
    if (!req.session.loggedInUser) {
      return res.status(403).json("Forbidden")  
    } 
    let blogInDB
    try {
      blogInDB = await blogs.getById(req.params.blogId)
    } catch (e) {
      res.status(e.code).json(e.error)
    }
    let deleted = false
    for (const x of blogInDB.comments) {
      if (x._id.toString() === req.params.commentId) {
        if (x.userThatPostedComment._id === req.session.loggedInUser._id) {
          deleted = true
          next()
        } else {
          return res.status(403).json({error: `You are not authorized to delete this comment`})
        }
      }
    }
    if (!deleted) {
      return res.status(404).json({error: `No comment with such ID found`})
    }
  }
})

app.use("/blog", (req, res, next) =>{
  if (req.method == "POST" || req.method == "PUT" || req.method == "PATCH") {
    if (!req.session.loggedInUser && !(req.originalUrl == "/blog/login" || req.originalUrl == "/blog/signup")) {
      return res.status(403).json("Forbidden")   
    }
  }
    next()
})

app.use("/blog/:id", async (req, res, next) => {
    if (req.method == "PUT" || req.method == "PATCH") {
      let blogWithId
      try {
      blogWithId = await blogs.getById(req.params.id) 
      } catch (e) {
        return res.status(e.code).json(e.error)
      }
      if (blogWithId.userThatPosted._id != req.session.loggedInUser._id) {
        return res.status(403).json({error: `You do not have access to edit this blog`})
      }
  }
  next()
})

// MIDDLEWARE ENDS


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});