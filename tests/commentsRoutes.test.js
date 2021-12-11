const session = require("supertest-session");
const supertest = require("supertest")

const app = require("../server")

const request = supertest(app)

let testSession;

describe("Authenticated Comments Endpoints", () => {
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

    it("Should successfully add a comment with content 'Test Comment' made by user with ID 1 in thought with ID 2", async () => {
        const res = await authenticatedSession
        .post("/comments/add")
        .send({
            id: 2,
            content: "Test Comment"
        });

        expect(res.statusCode).toBe(302);
    });

    it("Should successfully delete a comment with ID 2", async () => {
        const res = await authenticatedSession
        .post("/comments/delete")
        .send({
            id: 2,
        });

        expect(res.statusCode).toBe(302);
    });

    it("Should successfully update a comment with ID 3 from 'Test Comment' to 'Test Comment!'", async () => {
        const res = await authenticatedSession
        .post("/comments/edit")
        .send({
            commentid: 3,
            content: "Test Comment!"
        });

        expect(res.statusCode).toBe(302);
    });

    it("Should fail to delete a comment with ID 3 logged as an user with ID different than 2", async () => {
        const res = await authenticatedSession
        .post("/comments/delete")
        .send({
            id: 3
        });

        expect(res.statusCode).toBe(400);
    });
});

describe("Unauthenticated Comments Endpoints", () => {
    beforeAll(function (done) {
        testSession = session(app);

        done();
    });
    
    it("Should fail to add a comment with content 'Test Comment' in thought with ID 2", async () => {
        const res = await testSession
        .post("/comments/add")
        .send({
            id: 2,
            content: "Test Comment"
        });

        expect(res.statusCode).toBe(302);
    });

    it("Should fail to delete a comment with ID 1 as an unlogged user", async () => {
        const res = await testSession
        .post("/comments/delete")
        .send({
            id: 1
        });

        expect(res.statusCode).toBe(302);
    });
});