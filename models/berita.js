const { DataTypes, TableHints, Association } = require("sequelize");
const sequelize = require (".");

module.exports = (sequelize, DataTypes) => {
    const Berita = sequelize.define("berita", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Nama tabel User Anda, pastikan sudah sesuai
                key: 'id'
            }
        }
    }, {
        tableName: 'berita'
    });

    Berita.associate = (models) => {
        Berita.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
    return Berita;
};
