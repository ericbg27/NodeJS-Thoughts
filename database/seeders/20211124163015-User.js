'use strict';

const bcrypt = require("bcryptjs")

const salt = bcrypt.genSaltSync(10)

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert(
     "Users", 
      [
        {
          id: 1,
          name: "Matheus",
          email: "matheus@teste.com",
          password: bcrypt.hashSync("1234", salt),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users");
  }
};
