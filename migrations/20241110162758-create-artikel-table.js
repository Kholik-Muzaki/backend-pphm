// models/Artikel.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Artikel = sequelize.define("Artikel", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Pastikan ini sesuai dengan nama tabel user di database
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Artikel', // Menentukan nama tabel sesuai keinginan
    freezeTableName: true // Mencegah Sequelize untuk mengubah nama tabel menjadi bentuk jamak
  });

  Artikel.associate = (models) => {
    Artikel.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Artikel;
};
