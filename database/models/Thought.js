'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Thought extends Model {
    static associate(models) {
      Thought.belongsTo(models.User, {
        onDelete: "CASCADE"
      })

      Thought.belongsToMany(models.User, { 
        through: models.Like, 
        as: "UserLike" 
      });

      Thought.hasMany(models.Comment);
    }
  };

  Thought.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    }
  }, {
    sequelize,
    modelName: 'Thought',
  });

  return Thought;
};