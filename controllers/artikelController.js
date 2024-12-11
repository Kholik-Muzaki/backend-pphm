const db = require('../models');

// Controller Artikel
const ArtikelController = {
    // Tambah Artikel
    createArtikel: async (req, res) => {
        const { title, content, date, author } = req.body;
        const user_id = req.user.id;

        try {
            const imagePath = req.file ? req.file.path : null;
            const artikel = await db.Artikel.create({
                image: imagePath,
                title,
                content,
                date,
                author,
                user_id
            });

            res.status(201).json({
                status: 'success',
                message: 'Artikel berhasil ditambahkan',
                data: artikel,
            });
        } catch (error) {
            console.error('Error creating artikel:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menambahkan artikel',
            });
        }
    },

    // Edit Artikel
    updateArtikel: async (req, res) => {
        const { id } = req.params;
        const { title, content, date, author } = req.body;

        try {
            const artikel = await db.Artikel.findByPk(id);
            if (!artikel) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Artikel tidak ditemukan',
                });
            }

            // Update gambar jika ada file baru
            if (req.file) {
                artikel.image = req.file.path;
            }

            // Update field lainnya
            artikel.title = title || artikel.title;
            artikel.content = content || artikel.content;
            artikel.date = date || artikel.date;
            artikel.author = author || artikel.author;

            await artikel.save();

            res.status(200).json({
                status: 'success',
                message: 'Artikel berhasil diperbarui',
                data: artikel,
            });
        } catch (error) {
            console.error('Error updating artikel:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat memperbarui artikel',
            });
        }
    },

    // Delete Artikel
    deleteArtikel: async (req, res) => {
        const { id } = req.params;

        try {
            const artikel = await db.Artikel.findByPk(id);
            if (!artikel) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Artikel tidak ditemukan',
                });
            }

            await artikel.destroy();

            res.status(200).json({
                status: 'success',
                message: 'Artikel berhasil dihapus',
            });
        } catch (error) {
            console.error('Error deleting artikel:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menghapus artikel',
            });
        }
    },

    // Lihat Semua Artikel untuk User (tanpa login)
    getAllArtikel: async (req, res) => {
        try {
            const artikels = await db.Artikel.findAll({
                attributes: ['id', 'image', 'title', 'content', 'date', 'author'],
                order: [['date', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                message: 'Semua artikel berhasil diambil',
                data: artikels,
            });
        } catch (error) {
            console.error('Error retrieving artikels:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil artikel',
            });
        }
    },

    // Lihat Detail Artikel untuk User/Public
    getArtikelPublic: async (req, res) => {
        const { id } = req.params;

        try {
            const artikel = await db.Artikel.findByPk(id, {
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username'],
                }],
            });

            if (!artikel) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Artikel tidak ditemukan',
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Detail artikel berhasil diambil',
                data: artikel,
            });
        } catch (error) {
            console.error('Error retrieving artikel:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil detail artikel',
            });
        }
    },

    // get summary total artikel
    getSummaryArtikel: async (req, res) => {
        try {
            // Menghitung total artikel
            const totalArtikel = await db.Artikel.count();

            // Mengirim respons dengan ringkasan data
            res.status(200).json({
                status: 'success',
                message: 'Ringkasan artikel berhasil diambil',
                data: {
                    totalArtikel,
                },
            });
        } catch (error) {
            console.error('Error retrieving artikel summary:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil ringkasan artikel',
            });
        }
    },

};

module.exports = ArtikelController;
