// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.development);

const db = {
    sequelize,
    Sequelize,
    User: require('./user')(sequelize, DataTypes),
};

module.exports = db;
