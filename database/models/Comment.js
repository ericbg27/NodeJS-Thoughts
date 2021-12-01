const { DataTypes } = require("sequelize")

const db = require("../../db/conn")

const Thought = require("./Thought")
const User = require("./User")

const Comment = db.define("Comment", {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        require: true
    }
})

Comment.belongsTo(Thought)
Comment.belongsTo(User)

Thought.hasMany(Comment)
User.hasMany(Comment)

module.exports = Comment