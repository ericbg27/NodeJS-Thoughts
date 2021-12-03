'use strict';

module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        userId: 1,
        thoughtId: 1
    }, {});

    Like.associate = function (models) {
    }

    // TODO: define handlers

    return Like;
}