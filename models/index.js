// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.development);

const db = {
    sequelize,
    Sequelize,
    User: require('./user')(sequelize, DataTypes),
    Keuangan: require('./keuangan')(sequelize, DataTypes),
    Artikel: require('./artikel')(sequelize, DataTypes),
};

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
