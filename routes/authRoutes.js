const express = require("express")
const router = express.Router()

const { User } = require("../database/models")
const AuthController = require("../controllers/AuthController")

const authController = new AuthController(User)

router.get("/login", authController.login.bind(authController))
router.post("/login", authController.loginPost.bind(authController))
router.get("/register", authController.register.bind(authController))
router.post("/register", authController.registerPost.bind(authController))
router.get("/logout", authController.logout.bind(authController))

module.exports = router