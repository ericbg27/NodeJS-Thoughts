'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Thought);

      User.hasMany(models.Comment);

      User.belongsToMany(models.Thought, { 
          through: models.Like 
      });
    }
  };

  User.init({
    name: {
      type: DataTypes.STRING,
      require: true,
    },
    email: {
        type: DataTypes.STRING,
        require: true,
    },
    password: {
        type: DataTypes.STRING,
        require: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};