'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Thoughts", 
       [
         {
           id: 1,
           title: "Test Thought",
           UserId: 1,
           createdAt: new Date(),
           updatedAt: new Date()
         },
         {
          id: 2,
          title: "Test Thought 2",
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          title: "Test Thought 3",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
       ]
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Thoughts");
  }
};
