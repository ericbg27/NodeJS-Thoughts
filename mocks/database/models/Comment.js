'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        content: "Mock Comment",
        userId: 1,
        thoughtId: 1
    }, {});

    Comment.associate = function (models) {
        Comment.belongsTo(models.Thought);

        Comment.belongsTo(models.User);
    }

    Comment.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "findAll") {
            if(queryOptions[0].where.thoughtId === 1) {
                if(queryOptions[0].where.userId === 2) {
                    return Comment.build({
                        content: "Test Comment",
                        userId: 2,
                        thoughtId: 1
                    });
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    })

    return Comment;
}