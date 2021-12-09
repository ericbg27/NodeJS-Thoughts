const { Comment } = require("../mocks/database/models");

const CommentController = require("../controllers/CommentController");
const commentController = new CommentController(Comment);

describe("CommentController createComment method tests", () => {
    it("Should successfully create a comment with content 'Test Comment' in thought with ID 1 by user with ID 2", async () => {
        const req = {
            message: undefined,
            session: {
                userid: 2,
                save: function(f) {
                    f();
                }
            },
            body: {
                id: 1,
                content: "Test Comment"
            },
            flash: function(type, msg) {
                this.message = msg;
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

        await commentController.createComment(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/");
        
        expect(req.message).toEqual("Comentário criado com sucesso!");

        expect(commentController.Comment.content).toEqual("Test Comment");
        expect(commentController.Comment.ThoughtId).toEqual(1);
        expect(commentController.Comment.UserId).toEqual(2);
        expect(commentController.Comment.id).toEqual(1);
    });
});

describe("CommentController deleteComment method tests", () => {
    it("Should successfully delete a comment with ID 1", async () => {
        const req = {
            message: undefined,
            session: {
                userid: 2,
                save: function(f) {
                    f();
                }
            },
            body: {
                id: 1
            },
            flash: function(type, msg) {
                this.message = msg;
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

        await commentController.deleteComment(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/");
        
        expect(req.message).toEqual("Comentário deletado com sucesso!");

        expect(commentController.Comment.id).toEqual(-1);
    });
});

describe("CommentController updateComment method tests", () => {
    it("Should successfully update a comment with ID 1 from 'Test Comment' to 'Test Comment!'", async () => {
        const req = {
            message: undefined,
            session: {
                userid: 2,
                save: function(f) {
                    f();
                }
            },
            body: {
                commentid: 1,
                content: "Test Comment!"
            },
            flash: function(type, msg) {
                this.message = msg;
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

        const comment = {
            id: 1,
            content: "Test Comment",
            UserId: 2,
            ThoughtId: 2
        };

        commentController.Comment.create(comment);

        await commentController.updateComment(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.urlRedirect).toEqual("/");
        
        expect(req.message).toEqual("Comentário atualizado com sucesso!");

        expect(commentController.Comment.content).toEqual("Test Comment!");
    });
});