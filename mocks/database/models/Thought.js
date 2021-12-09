'use strict';

module.exports = (sequelize, DataTypes) => {
    const Thought = sequelize.define("Thought", {
        title: "Mock Title",
        UserId: 1,
    }, {});

    Thought.create = Thought.upsert; //Workaround to deal with create function problem in sequelize-mock

    Thought.associate = function (models) {
        Thought.belongsTo(models.User)

        Thought.belongsToMany(models.User, { 
            through: models.Like, 
            as: "UserLike" 
        });

        Thought.hasMany(models.Comment);
    };

    Thought.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "findAll") {
            const thought1 = Thought.build({
                title: "Test Thought 1",
                UserId: 1,
                UserLike: [
                    {
                        name: "User2",
                        id: 2,
                    }
                ],
                Comments: [
                    {
                        id: 1,
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
                        name: "User1",
                        id: 1,
                    },
                    {
                        name: "User4",
                        id: 4
                    }
                ],
                Comments: [
                    {
                        id: 2,
                        UserId: 1,
                        content: "Test Comment by User 1"
                    }
                ]
            });
            const thought3 = Thought.build({
                title: "Test Thought 3",
                UserId: 3,
                UserLike: [
                    {
                        name: "User1",
                        id: 1,
                    },
                    {
                        name: "User2",
                        id: 2,
                    },
                    {
                        name: "User3",
                        id: 1,
                    }
                ],
                Comments: [
                    {
                        id: 3,
                        UserId: 1,
                        content: "Test Comment by User 1"
                    }
                ]
            });

            let thoughts = [];

            if(queryOptions[0].where.UserId) {
                if(queryOptions[0].where.UserId === 1) {
                    thoughts.push(thought1);
                } else if(queryOptions[0].where.UserId === 2) {
                    thoughts.push(thought2);
                } else if(queryOptions[0].where.UserId === 3) {
                    thoughts.push(thought3);
                }
            } else {
                thoughts.push(thought1);
                thoughts.push(thought2);
                thoughts.push(thought3);
            }

            return thoughts;
        }
    });

    Thought.$queryInterface.$useHandler(function(query, queryOptions, done) {
        if(query === "upsert") {
            const thought = queryOptions[0];

            Thought.title = thought.title;
            Thought.UserId = thought.UserId;
        }
    });

    return Thought;
}