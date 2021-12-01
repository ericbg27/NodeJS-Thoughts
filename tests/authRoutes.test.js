const supertest = require("supertest")

const app = require("../server")

const request = supertest(app)

describe("Unauthenticated auth endpoints", () => {
    it("Should be able to access the register page", async () => {
        await request
        .get("/register")
        .expect(200);
    });

    it("Should be able to access the login page", async () => {
        await request
        .get("/login")
        .expect(200);
    });

    it("Should be able to register user", async () => {
        await request
        .post("/register")
        .send({
            name: "Luis",
            email: "luis@email.com",
            password: "12345",
            confirmpassword: "12345"
        })
        .expect(302)
        .resolves;
    });
})

describe("Error In Authentication", () => {
    it("Should receive a 400 HTTP status when sending a non-existing user in login", async () => {
        const res = await request
        .post("/login")
        .send({
            email: "",
            password: ""
        })

        expect(res.statusCode).toBe(400);
    });

    it("Should receive a 400 HTTP status when sending the wrong password for an existing user in login", async () => {
        const res = await request
        .post("/login")
        .send({
            email: "matheus@teste.com",
            password: ""
        });

        expect(res.statusCode).toBe(400);
    });

    it("Should receive a 400 HTTP status when sending an already used email", async () => {
        const res = await request
        .post("/register")
        .send({
            name: "Matheus",
            email: "matheus@teste.com",
            password: "1234",
            confirmpassword: "1234"
        });

        expect(res.statusCode).toBe(400);
    });

    it("Should receive a 400 HTTP status when sending wrong password confirmation", async () => {
        const res = await request
        .post("/register")
        .send({
            name: "Pedro",
            email: "pedro@email.com",
            password: "1234",
            confirmpassword: "123"
        });

        expect(res.statusCode).toBe(400);
    });
})