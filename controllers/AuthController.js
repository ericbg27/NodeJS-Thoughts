const bcrypt = require("bcryptjs")

module.exports = class AuthController {
    constructor(User) {
        this.User = User
    }

    login(req, res) {
        res.status(200)
        res.render("auth/login")
    }

    async loginPost(req, res) {
        const {email, password} = req.body

        // find user
        const user = await this.User.findOne({where: {email: email}})

        if(!user) {
            req.flash("message", "Usuário não encontrado!")

            res.status(400)
            res.render("auth/login")

            return
        }

        // check if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash("message", "Senha inválida!")
            
            res.status(400)
            res.render("auth/login")

            return
        }

        // initialize session
        req.session.userid = user.id

        req.flash("message", "Autenticação realizada com sucesso!")

        req.session.save(() => {
            res.redirect("/")
        })
    }

    register(req, res) {
        res.status(200)
        res.render("auth/register")
    }

    async registerPost(req, res) {
        const {name, email, password, confirmpassword} = req.body

        // password match validation
        if(password != confirmpassword) {
            req.flash("message", "As senhas não conferem, tente novamente!")

            res.status(400)
            res.render("auth/register")

            return
        }

        // Check if user exists
        const checkIfUserExists = await this.User.findOne({where: {email: email}})

        if(checkIfUserExists) {
            req.flash("message", "O e-mail já está em uso!")

            res.status(400)
            res.render("auth/register")

            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await this.User.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash("message", "Cadastro realizado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch(err) {
            console.log(err)
        }
    }

    logout(req, res) {
        req.session.destroy()
        res.redirect("/login")
    }
}