const Thought = require("../models/Thought")
const User = require("../models/User")
const Comment = require("../models/Comment")

const { Op } = require("sequelize")

module.exports = class CommentController {
    static async createComment(req, res) {
        const thoughtId = req.body.id;
        const userId = req.session.userid;

        const contentData = req.body.content;
        const content = contentData.join("").trim()
        
        const comment = {
            content: content,
            ThoughtId: thoughtId,
            UserId: userId
        }

        try {
            await Comment.create(comment)

            req.flash("message", "Comentário criado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }
}