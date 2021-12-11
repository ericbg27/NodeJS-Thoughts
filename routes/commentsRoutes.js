const express = require("express")
const router = express.Router()

const { Comment } = require("../database/models")
const CommentController = require("../controllers/CommentController")

const commentController = new CommentController(Comment)

// helpers
const checkAuth = require("../helpers/auth").checkAuth
const checkComment = require("../helpers/commentValidator").checkComment

router.post("/add", [checkAuth, checkComment], commentController.createComment.bind(commentController))
router.post("/delete", checkAuth, commentController.deleteComment.bind(commentController))
router.post("/edit", [checkAuth, checkComment], commentController.updateComment.bind(commentController))

module.exports = router