'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "comments", 
      [
        {
          id: 1,
          content: "Comment 1",
          UserId: 1,
          ThoughtId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          content: "Comment 2",
          UserId: 1,
          ThoughtId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          content: "Comment 3",
          UserId: 2,
          ThoughtId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("comments");
  }
};
