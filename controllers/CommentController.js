const { Op } = require("sequelize")

module.exports = class CommentController {
    constructor(Comment) {
        this.Comment = Comment
    }

    async createComment(req, res) {
        const thoughtId = req.body.id
        const userId = req.session.userid

        const contentData = req.body.content;
        const content = contentData.trim()
        
        const comment = {
            content: content,
            ThoughtId: thoughtId,
            UserId: userId
        }

        try {
            await this.Comment.create(comment)

            req.flash("message", "Comentário criado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    async deleteComment(req, res) {
        const commentId = req.body.id

        console.log(commentId)

        const comment = await this.Comment.findOne({
            where: { 
                id: commentId 
            },
            raw: true,
        })

        if(!comment) {
            res.redirect("/");
        } else {
            if(req.session.userid !== comment.UserId) {
                req.flash("message", "Você não pode deletar esse comentário!")
                
                res.status(400)
                res.render("/thoughts/home")

                return
            }
            
            try {
                await this.Comment.destroy({ where: { id: commentId } })

                req.flash("message", "Comentário deletado com sucesso!")

                req.session.save(() => {
                    res.redirect("/")
                })
            } catch(error) {
                console.log(`Aconteceu um erro ${error}`)
            }
        }
    }

    async updateComment(req, res) {
        const commentId = req.body.commentid
        const newContent = req.body.content
        
        const comment = {
            id: commentId,
            content: newContent
        }

        try {
            await this.Comment.update(comment, { where: { id: commentId } })

            req.flash("message", "Comentário atualizado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro: ${error}`)
        }
    }
}