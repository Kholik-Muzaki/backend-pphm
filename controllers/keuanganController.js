const db = require('../models');

// Controller Keuangan
const KeuanganController = {
    // Tambah Data Keuangan
    createKeuangan: async (req, res) => {
        const { jenisTransaksi, jumlah, tanggal, keterangan } = req.body;
        const user_id = req.user.id;

        try {
            const keuangan = await db.Keuangan.create({
                jenisTransaksi,
                jumlah,
                tanggal,
                keterangan,
                user_id,
            });

            res.status(201).json({
                status: 'success',
                message: 'Data keuangan berhasil ditambahkan',
                data: keuangan,
            });
        } catch (error) {
            console.error('Error creating keuangan:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menambahkan data keuangan',
            });
        }
    },

    // Lihat Detail Data Keuangan
    getKeuangan: async (req, res) => {
        const { id } = req.params;

        try {
            const keuangan = await db.Keuangan.findByPk(id, {
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'role'],
                }],
            });

            if (!keuangan) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Data keuangan tidak ditemukan',
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Detail data keuangan berhasil diambil',
                data: keuangan,
            });
        } catch (error) {
            console.error('Error retrieving keuangan:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil data keuangan',
            });
        }
    },

    // Edit Data Keuangan
    updateKeuangan: async (req, res) => {
        const { id } = req.params;
        const { jenisTransaksi, jumlah, tanggal, keterangan } = req.body;

        try {
            const keuangan = await db.Keuangan.findByPk(id);
            if (!keuangan) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Data keuangan tidak ditemukan',
                });
            }

            // Update data
            keuangan.jenisTransaksi = jenisTransaksi || keuangan.jenisTransaksi;
            keuangan.jumlah = jumlah || keuangan.jumlah;
            keuangan.tanggal = tanggal || keuangan.tanggal;
            keuangan.keterangan = keterangan || keuangan.keterangan;

            await keuangan.save();

            res.status(200).json({
                status: 'success',
                message: 'Data keuangan berhasil diperbarui',
                data: keuangan,
            });
        } catch (error) {
            console.error('Error updating keuangan:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat memperbarui data keuangan',
            });
        }
    },

    // Hapus Data Keuangan
    deleteKeuangan: async (req, res) => {
        const { id } = req.params;

        try {
            const keuangan = await db.Keuangan.findByPk(id);
            if (!keuangan) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Data keuangan tidak ditemukan',
                });
            }

            await keuangan.destroy();

            res.status(200).json({
                status: 'success',
                message: 'Data keuangan berhasil dihapus',
            });
        } catch (error) {
            console.error('Error deleting keuangan:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menghapus data keuangan',
            });
        }
    },

    // Lihat Semua Data Keuangan
    getAllKeuangan: async (req, res) => {
        try {
            const keuanganList = await db.Keuangan.findAll({
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'role'],
                }],
                order: [['tanggal', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                message: 'Semua data keuangan berhasil diambil',
                data: keuanganList,
            });
        } catch (error) {
            console.error('Error retrieving keuangan list:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil data keuangan',
            });
        }
    },

    // Lihat Ringkasan Data Keuangan
    getSummary: async (req, res) => {
        try {
            // Menggunakan agregasi untuk menghitung jumlah transaksi masuk, transaksi keluar, total pemasukan, dan total pengeluaran
            const summary = await db.Keuangan.findAll({
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN jenisTransaksi = 'pemasukan' THEN 1 ELSE NULL END")), 'transaksiMasuk'],
                    [db.sequelize.fn('COUNT', db.sequelize.literal("CASE WHEN jenisTransaksi = 'pengeluaran' THEN 1 ELSE NULL END")), 'transaksiKeluar'],
                    [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN jenisTransaksi = 'pemasukan' THEN jumlah ELSE 0 END")), 'totalPemasukan'],
                    [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN jenisTransaksi = 'pengeluaran' THEN jumlah ELSE 0 END")), 'totalPengeluaran'],
                ],
            });

            const { transaksiMasuk, transaksiKeluar, totalPemasukan, totalPengeluaran } = summary[0].dataValues;

            const saldo = parseFloat(totalPemasukan) - parseFloat(totalPengeluaran);

            res.status(200).json({
                status: 'success',
                message: 'Ringkasan data keuangan berhasil diambil',
                data: {
                    transaksiMasuk: parseInt(transaksiMasuk, 10) || 0,
                    transaksiKeluar: parseInt(transaksiKeluar, 10) || 0,
                    totalPemasukan: parseFloat(totalPemasukan) || 0,
                    totalPengeluaran: parseFloat(totalPengeluaran) || 0,
                    saldo: saldo || 0,
                },
            });
        } catch (error) {
            console.error('Error retrieving summary:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil ringkasan data keuangan',
            });
        }
    },


};

module.exports = KeuanganController;
