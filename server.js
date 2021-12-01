const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const flash = require("express-flash")

const app = express()

// Models
const Thought = require("./database/models/Thought")
const User = require("./database/models/User")
const Like = require("./database/models/Like")
const Comment = require("./database/models/Comment")

// Import Router
const commentsRoutes = require("./routes/commentsRoutes")
const thoughtsRoutes = require("./routes/thoughtsRoutes")
const authRoutes = require("./routes/authRoutes")

// Import Controllers
const ThoughtController = require("./controllers/ThoughtController")
const CommentController = require("./controllers/CommentController")

app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")

// receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require("path").join(require("os").tmpdir(), "sessions"),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

// flash messages
app.use(flash())

// public path
app.use(express.static("public"))

// set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// Router
app.use("/comments", commentsRoutes)
app.use("/thoughts", thoughtsRoutes)
app.use("/", authRoutes)

app.get("/", ThoughtController.showThoughts)

module.exports = app