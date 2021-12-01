'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Thought)

      Comment.belongsTo(models.User)
    }
  };

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      require: true
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};