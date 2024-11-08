const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    // Hash password sebelum simpan ke database
    User.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    return User;
};
