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
    })

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
    })
});

describe("AuthController registerPost method tests", () => {
    // TODO
})