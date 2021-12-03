'use strict';

const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      name: "Eric",
      email: "eric@teste.com",
      password: bcrypt.hashSync("1234", salt),
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
        if(queryOptions[0].where.id === 1) {
          return User.build({
            id: 1,
            name: "Test",
            email: "test@email.com",
            password: "1234"
          });
        } else if(queryOptions[0].where.id === 1) {
          return User.build({
            id: 2,
            name: "Test 2",
            email: "test2@email.com",
            password: "1234"
          });
        } else {
          return null;
        }
      }
    });

    return User;
}

