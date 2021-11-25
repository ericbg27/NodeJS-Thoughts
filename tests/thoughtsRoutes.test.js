const request = require("supertest");
const session = require("supertest-session")

const app = require("../server")

let testSession;

beforeEach(async function () {
    testSession = session(app);
});

describe("Thoughts Endpoints", () => {
    let authenticatedSession;

    beforeEach(function (done) {
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
        })
        
        expect(res.statusCode).toBe(201)
    });
})