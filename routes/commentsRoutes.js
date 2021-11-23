const express = require("express")
const router = express.Router()
const CommentController = require("../controllers/CommentController")

// helpers
const checkAuth = require("../helpers/auth").checkAuth

router.post("/add", checkAuth, CommentController.createComment)
router.post("/delete", checkAuth, CommentController.deleteComment)

module.exports = router