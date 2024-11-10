module.exports = (sequelize, DataTypes) => {
    const Keuangan = sequelize.define('Keuangan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        jenisTransaksi: {
            type: DataTypes.STRING,
            allowNull: false
        },
        jumlah: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        keterangan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // pastikan nama tabel user Anda sesuai
                key: 'id'
            }
        }
    }, {
        tableName: 'keuangan' // tambahkan opsi ini untuk menetapkan nama tabel
    });

    Keuangan.associate = (models) => {
        Keuangan.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Keuangan;
};
