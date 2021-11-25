const { Sequelize } = require("sequelize")

const envConfigs = require("../database/config/config")
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

let sequelize;
if(config.url) {
    sequelize = new Sequelize(config.url, config)
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config)
}

module.exports = sequelize