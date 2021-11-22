const Thought = require("../models/Thought")
const User = require("../models/User")
const Like = require("../models/Like")

const { Op } = require("sequelize")

module.exports = class ThoughtController {
    static async showThoughts(req, res) {
        let search = ""

        if(req.query.search) {
            search = req.query.search
        }

        let order = ""

        if(req.query.order === "old") {
            order = "ASC"
        } else {
            order = "DESC"
        }

        const thoughtsData = await Thought.findAll({
            include: [User, {
                model: User,
                as: "UserLike"
            }],
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [["createdAt", order]],
        })

        const thoughts = thoughtsData.map((result) => result.get({ plain: true }))

        let thoughtsQty = thoughts.length

        if(thoughtsQty === 0) {
            thoughtsQty = false
        }

        const currentUserId = req.session.userid;

        for(let thought in thoughts) {
            let userLiked = false;
            if(currentUserId !== undefined) {
                for(let user in thoughts[thought].UserLike) {
                    if(thoughts[thought].UserLike[user].id == currentUserId) {
                        userLiked = true;

                        break;
                    }
                }
            }

            Object.defineProperty(thoughts[thought], "userLiked", {
                value: userLiked,
                enumerable: true
            })

            const likeNumber = thoughts[thought].UserLike.length;

            let userNames = []
            for(let i = 0; i < likeNumber; i++) {
                if(i == 2) {
                    break;
                }

                userNames.push(thoughts[thought].UserLike[i].name);
            }
            
            let likeString = "";
            if(likeNumber > 0) {
                likeString = "Curtido por ";
                if(likeNumber > 2) {
                    likeString = likeString.concat(userNames[0],", ");
                    likeString = likeString.concat(userNames[1]," ");

                    likeString = likeString.concat(`e mais ${likeNumber-2} outros`);
                } else {
                    if(likeNumber == 1) {
                        likeString = likeString.concat(userNames[0])
                    } else {
                        likeString = likeString.concat(userNames[0],"e ");
                        likeString = likeString.concat(userNames[1]);
                    }
                }
            }

            Object.defineProperty(thoughts[thought], "likeString", {
                value: likeString,
                enumerable: true
            })
        }

        res.render("thoughts/home", { thoughts, search, thoughtsQty })
    }

    static async dashboard(req, res) {
        let userId = req.session.userid
        if(userId === undefined) {
            userId = -1
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Thought,
            plain: true,
        })

        // check if user exists
        if(!user) {
            res.redirect("/login")

            return
        } else {
            const thoughts = user.Thoughts.map((result) => result.dataValues)

            let emptyThougths = false

            if(thoughts.length === 0) {
                emptyThougths = true
            }

            res.render("thoughts/dashboard", {thoughts, emptyThougths})
        }
    }

    static createThought(req, res) {
        res.render("thoughts/create")
    }

    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thought.create(thought)

            req.flash("message", "Pensamento criado com sucesso!")

            req.session.save(() => {
                res.redirect("/thoughts/dashboard")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    static async removeThought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Thought.destroy({where: {id: id, UserId: UserId}})

            req.flash("message", "Pensamento removido com sucesso!")

            req.session.save(() => {
                res.redirect("/thoughts/dashboard")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    static async updateThought(req, res) {
        const id = req.params.id

        const thought = await Thought.findOne({where: {id: id}, raw: true})

        res.render("thoughts/edit", {thought})
    }

    static async updateThoughtSave(req, res) {
        const id = req.body.id

        const thought = {
            title: req.body.title
        }

        try {
            await Thought.update(thought, {where: {id: id}})
            req.flash("message", "Pensamento atualizado com sucesso!")

            req.session.save(() => {
                res.redirect("/thoughts/dashboard")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    static async likeThought(req, res) {
        const thoughtId = req.body.id
        const userId = req.session.userid
        
        const like = {
            ThoughtId: thoughtId,
            UserId: userId
        }

        try {
            await Like.create(like)
           
            req.flash("message", "Curtida salva com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    static async unlikeThought(req, res) {
        const thoughtId = req.body.id
        const userId = req.session.userid

        try {
            await Like.destroy({ where: { thoughtId: thoughtId, userId: userId }})

            req.flash("message", "Curtida retirada com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }
}
