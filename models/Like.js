const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");
const Thought = require("./Thought");

const Like = db.define("Like", {});

User.belongsToMany(Thought, { through: Like });
Thought.belongsToMany(User, { through: Like, as: "UserLike" });

module.exports = Like;