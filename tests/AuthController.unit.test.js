const { User } = require("../mocks/database/models");

const AuthController = require("../controllers/AuthController");
const authController = new AuthController(User);

describe("AuthController loginPost method tests", () => {
    it("Should correctly authenticate user with ID 1", async () => {
        const req = {
            query: {},
            session: {
                save: function(f) {
                    f();
                }
            },
            body: {
                email: "test@email.com",
                password: "1234"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.loginPost(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/");

        expect(req.message).toEqual("Autenticação realizada com sucesso!");
        expect(req.session.userid).toEqual(1);
    });

    it("Should not find user with inexistent email", async () => {
        const req = {
            query: {},
            session: {
                userid: undefined,
                save: function(f) {
                    f();
                }
            },
            body: {
                email: "notexist@email.com",
                password: "1234"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = page;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.loginPost(req, res);

        expect(res.resStatus).toBe(400);
        expect(res.content).toEqual("auth/login");

        expect(req.message).toEqual("Usuário não encontrado!");
        expect(req.userid).toEqual(undefined);
    });

    it("Should not authenticate user due to wrong password", async () => {
        const req = {
            query: {},
            session: {
                userid: undefined,
                save: function(f) {
                    f();
                }
            },
            body: {
                email: "test@email.com",
                password: "12345"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = page;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.loginPost(req, res);

        expect(res.resStatus).toBe(400);
        expect(res.content).toEqual("auth/login");

        expect(req.message).toEqual("Senha inválida!");
        expect(req.session.userid).toEqual(undefined);
    });
});

describe("AuthController registerPost method tests", () => {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync(10);

    it("Should register an user with ID 1 successfully", async () => {
        const req = {
            query: {},
            session: {
                userid: undefined,
                save: function(f) {
                    f();
                }
            },
            body: {
                name: "User1",
                email: "user1@email.com",
                password: "12345",
                confirmpassword: "12345"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = page;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.registerPost(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/");

        expect(req.session.userid).toEqual(1);
        expect(req.message).toEqual("Cadastro realizado com sucesso!");

        expect(authController.User.name).toEqual("User1");
        expect(authController.User.email).toEqual("user1@email.com");
        expect(bcrypt.compareSync("12345", authController.User.password)).toEqual(true);
    });

    it("Should not register due to password mismatching", async () => {
        const req = {
            query: {},
            session: {
                userid: undefined,
                save: function(f) {
                    f();
                }
            },
            body: {
                name: "User1",
                email: "user1@email.com",
                password: "12345",
                confirmpassword: "1234"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = page;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.registerPost(req, res);

        expect(res.resStatus).toBe(400);
        expect(res.content).toEqual("auth/register");

        expect(req.message).toEqual("As senhas não conferem, tente novamente!");
    });

    it("Should not register due to email already in use", async () => {
        const req = {
            query: {},
            session: {
                userid: undefined,
                save: function(f) {
                    f();
                }
            },
            body: {
                name: "Test 1",
                email: "test@email.com",
                password: "1234",
                confirmpassword: "1234"
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            urlRedirect: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = page;
            },
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.registerPost(req, res);

        expect(res.resStatus).toBe(400);
        expect(res.content).toEqual("auth/register");

        expect(req.message).toEqual("O e-mail já está em uso!");
    });
});

describe("AuthController logout method test", () => {
    it("Should destroy the session and redirect to login page", async () => {
        const req = {
            session: {
                destroyed: false,
                destroy: function() {
                    this.destroyed = true;
                }
            }
        };
        const res = {
            resStatus: 0,
            redirected: false,
            urlRedirect: undefined,
            redirect: function(url) {
                this.resStatus = 302;
                this.urlRedirect = url;
                this.redirected = true;
            }
        };

        await authController.logout(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/login");

        expect(req.session.destroyed).toEqual(true);
    });
});