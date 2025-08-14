// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dbCfg = require('../config/db.config');

const sequelize = new Sequelize(dbCfg.DB, dbCfg.USER, dbCfg.PASSWORD, {
  host: dbCfg.HOST,
  port: dbCfg.port || 3306,
  dialect: dbCfg.dialect || 'mysql',
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Movimiento        = require('./movimientos')(sequelize, DataTypes);
db.Setting           = require('./Setting')(sequelize, DataTypes);
db.Suscripcion       = require('./Suscripcion')(sequelize, DataTypes);
db.Servicio          = require('./Servicio')(sequelize, DataTypes);
db.PlantillaQuincena = require('./PlantillaQuincena')(sequelize, DataTypes);

module.exports = db;
