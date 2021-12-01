'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
    }
  };

  Like.init({}, {
    sequelize,
    modelName: 'Like',
  });

  return Like;
};