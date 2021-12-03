'use strict';

module.exports = (sequelize, DataTypes) => {
    const Thought = sequelize.define("Thought", {
        title: "Mock Title",
        UserId: 1,
    }, {});

    Thought.associate = function (models) {
        Thought.belongsTo(models.User)

        Thought.belongsToMany(models.User, { 
            through: models.Like, 
            as: "UserLike" 
        });

        Thought.hasMany(models.Comment);
    }

    Thought.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "findAll") {
            const thought1 = Thought.build({
                title: "Test Thought 1",
                UserId: 1,
                UserLike: [
                    {
                        id: 2,
                    }
                ],
                Comments: [
                    {
                        UserId: 2,
                        content: "Test Comment by User 2"
                    }
                ]
            });
            const thought2 = Thought.build({
                title: "Test Thought 2",
                UserId: 2,
                UserLike: [
                    {
                        id: 1,
                    }
                ],
                Comments: [
                    {
                        UserId: 1,
                        content: "Test Comment by User 1"
                    }
                ]
            });

            let thoughts = [];

            if(queryOptions[0].where.userId) {
                if(queryOptions[0].where.userId === 1) {
                    thoughts.push(thought1);
                } else if(queryOptions.where.userId === 2) {
                    thoughts.push(thought2);
                }
            } else {
                thoughts.push(thought1);
                thoughts.push(thought2);
            }

            return thoughts;
        }
    })

    return Thought;
}