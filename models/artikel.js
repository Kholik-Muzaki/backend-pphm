const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Artikel = sequelize.define("Artikel", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.STRING, // Menyimpan path gambar
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
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Nama tabel user
                key: 'id'
            }
        }
    }, {
        tableName: 'artikel'
    });

    Artikel.associate = (models) => {
        Artikel.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Artikel;
};
