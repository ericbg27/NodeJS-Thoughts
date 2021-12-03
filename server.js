const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const flash = require("express-flash")

const app = express()

// Import Router
const commentsRoutes = require("./routes/commentsRoutes")
const thoughtsRoutes = require("./routes/thoughtsRoutes").router
const authRoutes = require("./routes/authRoutes")

// Import Models
const { User, Thought, Like, Comment } = require("./database/models")

// Import Controllers
const thoughtController = require("./routes/thoughtsRoutes").thoughtController

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

app.get("/", thoughtController.showThoughts.bind(thoughtController))

module.exports = app