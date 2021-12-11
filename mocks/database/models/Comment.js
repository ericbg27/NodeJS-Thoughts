'use strict';

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        content: "Mock Comment",
        UserId: 1,
        ThoughtId: 1
    }, {});

    Comment.create = Comment.upsert;

    Comment.associate = function (models) {
        Comment.belongsTo(models.Thought);

        Comment.belongsTo(models.User);
    }

    Comment.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "findOne") {
            if(queryOptions[0].where.id === 1) {
                return Comment.build({
                    id: 1,
                    content: "Test Comment 1",
                    ThoughtId: 1,
                    UserId: 2
                })
            }
        }
    })

    Comment.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "upsert") {
            const comment = queryOptions[0];
            
            Comment.id = 1;
            Comment.content = comment.content;
            Comment.ThoughtId = comment.ThoughtId;
            Comment.UserId = comment.UserId;
        }
    });

    Comment.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "destroy") {
            if(queryOptions[0].where.id === Comment.id) {
                Comment.id = -1;
            }
        }
    });

    Comment.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "update") {
            if(queryOptions[1].where.id === Comment.id) {
                Comment.content = queryOptions[0].content;
            }
        }

        return null;
    });

    return Comment;
}