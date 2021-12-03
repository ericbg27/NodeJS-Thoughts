const { User, Thought, Comment, Like } = require("../mocks/database/models");

const ThoughtController = require("../controllers/ThoughtController");
const thoughtController = new ThoughtController(User, Thought, Comment, Like);

describe("Thoughts controller methods", () => {
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
        expect(res.content.thoughtsQty).toEqual(2);

        const thought1 = res.content.thoughts[0];
        const thought2 = res.content.thoughts[1];

        // User should not own any thought
        expect(thought1.userOwns).toBe(false);
        expect(thought2.userOwns).toBe(false);

        // TODO
    });
})