'use strict';

const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      name: "Eric",
      email: "eric@teste.com",
      password: bcrypt.hashSync("1234"),
    }, {});

    User.associate = function (models) {
      User.hasMany(models.Thought);

      User.hasMany(models.Comment);

      User.belongsToMany(models.Thought, { 
          through: models.Like 
      });
    };

    User.$queryInterface.$useHandler(function(query, queryOptions, done) {
      if(query === "findOne") {
        if(queryOptions[0].where.id) {
          if(queryOptions[0].where.id === 1) {
            return User.build({
              id: 1,
              name: "Test",
              email: "test@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.id === 2) {
            return User.build({
              id: 2,
              name: "Test 2",
              email: "test2@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.id === 3) {
            return User.build({
              id: 3,
              name: "Test 3",
              email: "test3@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.id === 4) {
            return User.build({
              id: 4,
              name: "Test 4",
              email: "test4@email.com",
              password: bcrypt.hashSync("1234")
            });
          }
        } else if(queryOptions[0].where.email) {
          if(queryOptions[0].where.email === "test@email.com") {
            return User.build({
              id: 1,
              name: "Test",
              email: "test@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.email === "test2@email.com") {
            return User.build({
              id: 2,
              name: "Test 2",
              email: "test2@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.email === "test3@email.com") {
            return User.build({
              id: 3,
              name: "Test 3",
              email: "test3@email.com",
              password: bcrypt.hashSync("1234")
            });
          } else if(queryOptions[0].where.email === "test4@email.com") {
            return User.build({
              id: 4,
              name: "Test 4",
              email: "test4@email.com",
              password: bcrypt.hashSync("1234")
            });
          }
        }

        return null;
      }
    });

    return User;
}

