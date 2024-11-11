module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define("Image", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'album', // Pastikan ini merujuk ke tabel album yang benar
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        src: {
            type: DataTypes.STRING,
            allowNull: false
        },
        caption: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'image', // Tetapkan nama tabel secara eksplisit
        timestamps: true
    });

    Image.associate = (models) => {
        Image.belongsTo(models.Album, { foreignKey: 'album_id', as: 'album' });
    };

    return Image;
};
