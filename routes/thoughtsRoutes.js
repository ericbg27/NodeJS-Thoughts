const express = require("express")
const router = express.Router()

const { User, Thought, Comment, Like} = require("../database/models")

const ThoughtController = require("../controllers/ThoughtController")

const thoughtController = new ThoughtController(User, Thought, Like, Comment)

// helpers
const checkAuth = require("../helpers/auth").checkAuth

router.get("/add", checkAuth, thoughtController.createThought.bind(thoughtController))
router.post("/add", checkAuth, thoughtController.createThoughtSave.bind(thoughtController))
router.get("/edit/:id", checkAuth, thoughtController.updateThought.bind(thoughtController))
router.post("/edit", checkAuth, thoughtController.updateThoughtSave.bind(thoughtController))
router.get("/dashboard", checkAuth, thoughtController.dashboard.bind(thoughtController))
router.post("/remove", checkAuth, thoughtController.removeThought.bind(thoughtController))
router.post("/like", checkAuth, thoughtController.likeThought.bind(thoughtController))
router.post("/unlike", checkAuth, thoughtController.unlikeThought.bind(thoughtController))
router.get("/", thoughtController.showThoughts.bind(thoughtController))

module.exports = {
    router,
    thoughtController
}