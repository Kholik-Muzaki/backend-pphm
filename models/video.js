const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define("video", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: 'video'
    });

    Video.associate = (models) => {
        Video.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }

    return Video;
};
