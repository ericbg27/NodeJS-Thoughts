const fs = require('fs');
const path = require('path');

const SequelizeMock = require("sequelize-mock");

const sequelizeMock = new SequelizeMock();

const dbMock = {};

const basename = path.basename(__filename);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelizeMock, SequelizeMock.DataTypes);
    dbMock[model.name] = model;
  });

Object.keys(dbMock).forEach(modelName => {
    if (dbMock[modelName].associate) {
        dbMock[modelName].associate(dbMock);
    }
});

dbMock.Sequelize = SequelizeMock;
dbMock.sequelize = sequelizeMock;

module.exports = dbMock;