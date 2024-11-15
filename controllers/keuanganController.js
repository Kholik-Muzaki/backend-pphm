const db = require('../models');

// tambah data keuangan
exports.createKeuangan = async (req, res) => {
    const { jenisTransaksi, jumlah, tanggal, keterangan } = req.body;
    const user_id = req.user.id;

    try {
        const keuangan = await db.Keuangan.create({
            jenisTransaksi,
            jumlah,
            tanggal,
            keterangan,
            user_id
        });
        res.status(201).json({
            message: 'Keuangan berhasil ditambahkan', data: keuangan
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan keuangan',
        })
    }
}

// Lihat Detail Data Keuangan
exports.getKeuangan = async (req, res) => {
    const { id } = req.params;
    try {
        const keuangan = await db.Keuangan.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username', 'role']
            }]
        });
        if (!keuangan) {
            return res.status(404).json({
                message: 'Data keuangan tidak ditemukan'
            });
        }
        res.status(200).json(keuangan);
    } catch (error) {
        console.error('Error retrieving keuangan:', error);
        res.status(500).json({
            message: 'Error retrieving keuangan'
        });
    }
};

// Edit Data Keuangan
exports.updateKeuangan = async (req, res) => {
    const { id } = req.params;
    const { jenisTransaksi, jumlah, tanggal, keterangan } = req.body;

    try {
        const keuangan = await db.Keuangan.findByPk(id);
        if (!keuangan) {
            return res.status(404).json({
                message: 'Data keuangan tidak ditemukan'
            });
        }

        // Update data
        keuangan.jenisTransaksi = jenisTransaksi;
        keuangan.jumlah = jumlah;
        keuangan.tanggal = tanggal;
        keuangan.keterangan = keterangan;

        await keuangan.save();
        res.status(200).json({ message: 'Data keuangan berhasil diperbarui', keuangan });
    } catch (error) {
        console.error('Error updating keuangan:', error);
        res.status(500).json({ message: 'Error updating keuangan' });
    }
};

// Hapus Data Keuangan
exports.deleteKeuangan = async (req, res) => {
    const { id } = req.params;

    try {
        const keuangan = await db.Keuangan.findByPk(id);
        if (!keuangan) {
            return res.status(404).json({
                message: 'Data keuangan tidak ditemukan'
            });
        }

        await keuangan.destroy();
        res.status(200).json({
            message: 'Data keuangan berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting keuangan:', error);
        res.status(500).json({
            message: 'Error deleting keuangan'
        });
    }
};

exports.getAllKeuangan = async (req, res) => {
    try {
        const keuangan = await db.Keuangan.findAll({
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username', 'role']
            }]
        });
        res.status(200).json(keuangan);
    } catch (error) {
        console.error('Error retrieving keuangan:', error);
        res.status(500).json({
            message: 'Error retrieving keuangan'
        });
    }
}