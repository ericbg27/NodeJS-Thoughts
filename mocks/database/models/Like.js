'use strict';

module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {
        UserId: 1,
        ThoughtId: 1
    }, {});

    Like.create = Like.upsert; //Workaround to deal with create function problem in sequelize-mock

    Like.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "upsert") {
            const like = queryOptions[0];

            Like.UserId = like.UserId;
            Like.ThoughtId = like.ThoughtId;
        }
    });

    Like.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "destroy") {
            const like = queryOptions[0].where;

            if(like.thoughtId == Like.ThoughtId && like.userId == Like.UserId) {
                Like.UserId = -1;
                Like.ThoughtId = -1;
            }
        }
    });

    return Like;
}