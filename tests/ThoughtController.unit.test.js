const { User, Thought, Comment, Like } = require("../mocks/database/models");

const ThoughtController = require("../controllers/ThoughtController");
const thoughtController = new ThoughtController(User, Thought, Comment, Like);

describe("Thoughts controller showThoughts method test", () => {
    it("Should return two thoughts with their respective data for an unlogged user", async () => {
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
    });

    it("Should return two thoughts with their respective data for a logged user with ID 1", async () => {
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
        expect(thought2.likeString).toEqual("Curtido por Você e User4");
        expect(thought3.likeString).toEqual("Curtido por Você, User2 e mais 1 outros");
    });
})

describe("Thoughts controller dashboard method test", () => {
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
    })

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
    })

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
                this.redirected = true;
            }
        };

        await thoughtController.dashboard(req, res);

        //expect(res.resStatus).toBe(302);
        expect(res.redirected).toEqual(true);
        expect(res.content).toBe(undefined);
    })
})