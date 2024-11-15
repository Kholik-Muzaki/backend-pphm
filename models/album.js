module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define("Album", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'album', // Tetapkan nama tabel secara eksplisit
        timestamps: true
    });

    Album.associate = (models) => {
        Album.hasMany(models.Image, { foreignKey: 'album_id', as: 'images', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    };

    return Album;
};