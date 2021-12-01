'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "likes", 
       [
         {
           ThoughtId: 2,
           UserId: 1,
           createdAt: new Date(),
           updatedAt: new Date()
         }
       ]
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("likes");
  }
};
