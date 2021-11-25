const Thought = require("../models/Thought")
const User = require("../models/User")
const Like = require("../models/Like")
const Comment = require("../models/Comment")

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
            include: [User, 
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ["name"]
                    }
                }, 
                {
                    model: User,
                    as: "UserLike"
                }
            ],
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
            let userIsOwner = false
            if(thoughts[thought].UserId == currentUserId) {
                userIsOwner = true                
            }

            Object.defineProperty(thoughts[thought], "userOwns", {
                value: userIsOwner,
                enumerable: true
            })

            const thoughtLikes = thoughts[thought].UserLike;

            let currentUserLikeIndex = -1

            let userLiked = false;
            if(currentUserId !== undefined) {
                for(let user in thoughtLikes) {
                    if(thoughtLikes[user].id == currentUserId) {
                        userLiked = true;
                        currentUserLikeIndex = user

                        break;
                    }
                }
            }

            Object.defineProperty(thoughts[thought], "userLiked", {
                value: userLiked,
                enumerable: true
            })

            const likeNumber = thoughtLikes.length;

            let userNames = []
            if(userLiked) {
                userNames.push("Você")
            }

            for(let i = 0; i < thoughtLikes.length; i++) {
                if(i != currentUserLikeIndex) {
                    userNames.push(thoughtLikes[i].name);
                }

                if(userNames.length == 2) {
                    break;
                }
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
                        likeString = likeString.concat(userNames[0]," e ");
                        likeString = likeString.concat(userNames[1]);
                    }
                }
            }

            Object.defineProperty(thoughts[thought], "likeString", {
                value: likeString,
                enumerable: true
            })

            for(let comment in thoughts[thought].Comments) {
                let userOwns = false
                if(thoughts[thought].Comments[comment].UserId == currentUserId) {
                    userOwns = true
                }

                Object.defineProperty(thoughts[thought].Comments[comment], "Owns", {
                    value: userOwns,
                    enumerable: true
                })
            }
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
            //include: Thought,
            plain: true,
        })

        const userThoughts = await Thought.findAll({
            where: {
                UserId: userId,
            }
        })

        // check if user exists
        if(!user) {
            res.redirect("/login")

            return
        } else {    
            const thoughts = userThoughts.map((result) => result.get({ plain: true }))

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
                res.redirect(201, "/thoughts/dashboard")
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
                res.redirect(200, "/thoughts/dashboard")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }

    static async updateThought(req, res) {
        const id = req.params.id

        const thought = await Thought.findOne({where: {id: id}, raw: true})
        
        res.status(200)
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
                res.redirect(200, "/thoughts/dashboard")
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
                res.redirect(201, "/")
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
                res.redirect(200, "/")
            })
        } catch(error) {
            console.log(`Aconteceu um erro ${error}`)
        }
    }
}
