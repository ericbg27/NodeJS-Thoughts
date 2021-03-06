const { User, Thought, Comment, Like } = require("../mocks/database/models");

const ThoughtController = require("../controllers/ThoughtController");
const thoughtController = new ThoughtController(User, Thought, Like, Comment);

describe("Thoughts controller showThoughts method tests", () => {
    it("Should return three thoughts with their respective data for an unlogged user", async () => {
        const req = {
            query: {},
            session: {}
        };
        const res = {
            resStatus: 0,
            content: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            }
        };

        await thoughtController.showThoughts(req, res);

        expect(res.resStatus).toBe(200);
        expect(res.content).not.toBe(undefined);
        expect(res.content.thoughtsQty).toEqual(3);

        const thought1 = res.content.thoughts[0];
        const thought2 = res.content.thoughts[1];
        const thought3 = res.content.thoughts[2];

        // User should not own any thought
        expect(thought1.userOwns).toBe(false);
        expect(thought2.userOwns).toBe(false);
        expect(thought3.userOwns).toBe(false);

        // User should not have liked any thought
        expect(thought1.userLiked).toBe(false);
        expect(thought2.userLiked).toBe(false);
        expect(thought3.userLiked).toBe(false);

        // likeString should have been correctly defined based on user IDs
        expect(thought1.likeString).toEqual("Curtido por User2");
        expect(thought2.likeString).toEqual("Curtido por User1 e User4");
        expect(thought3.likeString).toEqual("Curtido por User1, User2 e mais 1 outros");

        // userIsLogged variable should evaluate to false
        expect(res.content.userIsLogged).toEqual(false);
    });

    it("Should return three thoughts with their respective data for a logged user with ID 1", async () => {
        const req = {
            query: {},
            session: { userid: 1 }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            }
        };

        await thoughtController.showThoughts(req, res);

        expect(res.resStatus).toBe(200);
        expect(res.content).not.toBe(undefined);
        expect(res.content.thoughtsQty).toEqual(3);

        const thought1 = res.content.thoughts[0];
        const thought2 = res.content.thoughts[1];
        const thought3 = res.content.thoughts[2];

        // User should not own first thought
        expect(thought1.userOwns).toBe(true);
        expect(thought2.userOwns).toBe(false);
        expect(thought3.userOwns).toBe(false);

        // User should have liked the second and third thoughts
        expect(thought1.userLiked).toBe(false);
        expect(thought2.userLiked).toBe(true);
        expect(thought3.userLiked).toBe(true);

        // likeString should have been correctly defined based on user IDs
        expect(thought1.likeString).toEqual("Curtido por User2");
        expect(thought2.likeString).toEqual("Curtido por Voc?? e User4");
        expect(thought3.likeString).toEqual("Curtido por Voc??, User2 e mais 1 outros");

        // userIsLogged variable should evaluate to true
        expect(res.content.userIsLogged).toEqual(true);
    });

    it("Should return two thoughts where one has a comment with ID 2 that has userEditing parameter equal to true", async () => {
        const req = {
            query: {
                commentid: 2
            },
            session: { userid: 1 }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            }
        };

        await thoughtController.showThoughts(req, res);

        expect(res.resStatus).toBe(200);
        expect(res.content).not.toBe(undefined);
        expect(res.content.thoughtsQty).toEqual(3);

        const thought1 = res.content.thoughts[0];
        const thought2 = res.content.thoughts[1];
        const thought3 = res.content.thoughts[2];

        expect(thought1.Comments[0].userEditing).toEqual(false);
        expect(thought2.Comments[0].userEditing).toEqual(true);
        expect(thought3.Comments[0].userEditing).toEqual(false);
    })
})

describe("Thoughts controller dashboard method tests", () => {
    it("Should return one thought which belongs to user with ID 1", async () => {
        const req = {
            query: {},
            session: { userid: 1 }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            },
            redirect: function(url) {
                this.redirected = true;
            }
        };

        await thoughtController.dashboard(req, res);

        expect(res.resStatus).toBe(200);
        expect(res.redirected).toEqual(false);
        expect(res.content).not.toBe(undefined);
        
        const thoughts = res.content.thoughts;
        const emptyThougths = res.content.emptyThougths;

        expect(emptyThougths).toEqual(false);
        expect(thoughts.length).toEqual(1);

        const onlyThought = thoughts[0];

        expect(onlyThought.title).toEqual("Test Thought 1");
        expect(onlyThought.UserId).toEqual(1);
    });

    it("Should return no thoughts since user with ID 4 has no thoughts", async () => {
        const req = {
            query: {},
            session: { userid: 4 }
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            },
            redirect: function(url) {
                this.redirected = true;
            }
        };

        await thoughtController.dashboard(req, res);

        expect(res.resStatus).toBe(200);
        expect(res.redirected).toEqual(false);
        expect(res.content).not.toBe(undefined);
        
        const thoughts = res.content.thoughts;
        const emptyThougths = res.content.emptyThougths;

        expect(emptyThougths).toEqual(true);
        expect(thoughts.length).toEqual(0);
    });

    it("Should redirect for an unlogged user", async () => {
        const req = {
            query: {},
            session: {}
        };
        const res = {
            resStatus: 0,
            content: undefined,
            redirected: false,
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            },
            redirect: function(url) {
                res.resStatus = 302;
                this.redirected = true;
            }
        };

        await thoughtController.dashboard(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.content).toBe(undefined);
    });
})

describe("Thoughts controller createThoughtSave method tests", () => {
    it("Should create a thought with title 'Test Title' with user ID 1", async () => {
        const req = {
            query: {},
            session: { 
                userid: 1,
                save: function(f) {
                    f();
                }
            },
            body: {
                title: "Test Title"
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
            status: function(value) { this.resStatus = value; },
            render: function(page, data) { 
                this.content = data;
            },
            redirect: function(url) {
                res.resStatus = 302;
                this.redirected = true;
            }
        };

        const oldTitle = thoughtController.Thought.title;
        const oldUserId = thoughtController.Thought.UserId;

        await thoughtController.createThoughtSave(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(req.message).toEqual("Pensamento criado com sucesso!");

        expect(thoughtController.Thought.title).toEqual("Test Title");
        expect(thoughtController.Thought.UserId).toEqual(1);

        thoughtController.Thought.title = oldTitle;
        thoughtController.Thought.UserId = oldUserId;
    });

    it("Should not create a thought with title 'Test Title' and should redirect to login page", async () => {
        const req = {
            query: {},
            session: {},
            body: {
                title: "Test Title"
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
                res.resStatus = 302;
                this.redirected = true;
                this.urlRedirect = url;
            }
        };

        await thoughtController.createThoughtSave(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.urlRedirect).toEqual("/login");
        expect(res.redirected).toEqual(true);

        expect(thoughtController.Thought.title).not.toEqual("Test Title");
    });
})

describe("Thoughts controller likeThought and unlikeThought methods tests", () => {
    let originalUserId, originalThoughtId;

    beforeAll(function() {
        originalUserId = thoughtController.Like.UserId;
        originalThoughtId = thoughtController.Like.ThoughtId;
    });

    afterAll(function() {
        thoughtController.Like.UserId = originalUserId;
        thoughtController.Like.ThoughtId = originalThoughtId;
    });

    it("Should create a like in thought with ID 3 by user with ID 2", async () => {
        const req = {
            query: {},
            session: { 
                userid: 2,
                save: function(f) {
                    f();
                }
            },
            body: {
                id: 3
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            redirected: false,
            status: function(value) { this.resStatus = value; },
            redirect: function(url) {
                res.resStatus = 302;
                this.redirected = true;
            }
        };

        await thoughtController.likeThought(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);

        expect(req.message).toEqual("Curtida salva com sucesso!");
        
        expect(thoughtController.Like.UserId).toEqual(2);
        expect(thoughtController.Like.ThoughtId).toEqual(3);
    });

    it("Should delete like in thought with ID 3 by user with ID 2", async () => {
        const req = {
            query: {},
            session: { 
                userid: 2,
                save: function(f) {
                    f();
                }
            },
            body: {
                id: 3
            },
            message: undefined,
            flash: function(type, msg) {
                this.message = msg;
            }
        };
        const res = {
            resStatus: 0,
            redirected: false,
            status: function(value) { this.resStatus = value; },
            redirect: function(url) {
                res.resStatus = 302;
                this.redirected = true;
            }
        };

        await thoughtController.unlikeThought(req, res);

        expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);

        expect(req.message).toEqual("Curtida retirada com sucesso!");

        expect(thoughtController.Like.ThoughtId).toEqual(-1);
        expect(thoughtController.Like.UserId).toEqual(-1);
    })
})