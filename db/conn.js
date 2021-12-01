const { Sequelize } = require("sequelize")

const envConfigs = require("../database/config/config")
const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

console.log(env)

let sequelize;
if(config.url) {
    sequelize = new Sequelize(config.url, config)
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config)
}

try {
    sequelize.authenticate()
    console.log("Conectamos com sucesso!")
} catch(err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize