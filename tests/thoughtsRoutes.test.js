const session = require("supertest-session")

const app = require("../server")

let testSession;

beforeAll(async function () {
    testSession = session(app);
});

describe("Thoughts Endpoints", () => {
    let authenticatedSession;

    beforeAll(function (done) {
        testSession.post("/login")
            .send({
                email: "matheus@teste.com",
                password: "1234"
            })
            .expect(200)
            .end(function (err) {
                if(err) {
                    return done(err);
                }

                authenticatedSession = testSession;
                return done();
            });
    });

    it("A thought with title 'Test title' and UserId 1 should be created", async () => {
        const res = await authenticatedSession
        .post("/thoughts/add")
        .send({
            title: "Test title"
        });
        
        expect(res.statusCode).toBe(201);
    });

    it("A thought with id 1 and UserId 1 should be deleted", async () => {
        const res = await authenticatedSession
        .post("/thoughts/remove")
        .send({
            id: 1
        })
        
        expect(res.statusCode).toBe(200)
    });

    it("A thought with id 2 and UserId 1 should be edited", async () => {
        const res = await authenticatedSession
        .post("/thoughts/edit")
        .send({
            id: 2,
            title: "Edited Thought"
        })
        
        expect(res.statusCode).toBe(200)
    });

    it("A thought with id 4 should liked by user 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/like")
        .send({
            id: 4,
        })
        
        expect(res.statusCode).toBe(201)
    });

    it("A thought with id 2 should unliked by user 1", async () => {
        const res = await authenticatedSession
        .post("/thoughts/unlike")
        .send({
            id: 2,
        })
        
        expect(res.statusCode).toBe(200)
    });
})