const session = require("supertest-session");
const supertest = require("supertest")

const app = require("../server")

const request = supertest(app)

let testSession;

describe("Authenticated Thoughts Endpoints", () => {
    let authenticatedSession;

    beforeAll(function (done) {
        testSession = session(app);

        testSession.post("/login")
            .send({
                email: "matheus@teste.com",
                password: "1234"
            })
            .expect(302)
            .end(function (err) {
                if(err) {
                    return done(err);
                }

                authenticatedSession = testSession;
                return done();
            });
    });

    it("Should return 200 status code when accessing dashboard", async () => {
        authenticatedSession
        .get("/thoughts/dashboard")
        .expect(200)
        .resolves
    });

    it("Should create a thought with title 'Test title' and UserId 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/add")
        .send({
            title: "Test title"
        });
        
        expect(res.statusCode).toBe(302);
    });

    it("Should delete a thought with id 1 and UserId 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/remove")
        .send({
            id: 1
        })
        
        expect(res.statusCode).toBe(302)
    });

    it("Should edit a thought with id 2 and UserId 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/edit")
        .send({
            id: 2,
            title: "Edited Thought"
        })
        
        expect(res.statusCode).toBe(302)
    });

    it("Should create a like in a thought with id 4 by an user with id 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/like")
        .send({
            id: 4,
        })
        
        expect(res.statusCode).toBe(302)
    });

    it("Should delete a like by an user with id 1 in a thought with id 2", async () => {
        const res = await authenticatedSession
        .post("/thoughts/unlike")
        .send({
            id: 2,
        })
        
        expect(res.statusCode).toBe(302)
    });
})

describe("Unauthenticated Thoughts Endpoints", () => {
    it("Should be able to access the homepage", async () => {
        await request
        .get("/")
        .expect(200);
    });

    it("Should return 401 status code when accessing dashboard", async () => {
        await request
        .get("/thoughts/dashboard")
        .expect(401)
        .resolves;
    });

    it("Should not be able to create a thought", async () => {
        await request
        .post("/thoughts/add")
        .send({
            title: "Test title"
        })
        .expect(302)
        .resolves;
    });

    it("Should not be able to delete a thought", async () => {
        await request
        .post("/thoughts/remove")
        .send({
            id: 2
        })
        .expect(302)
        .resolves;
    });
})