const db = require('../models');

// Controller Berita
const BeritaController = {
    // Tambah Berita (Admin Only)
    createBerita: async (req, res) => {
        const { title, content, date, author } = req.body;
        const user_id = req.user.id;

        try {
            const imagePath = req.file ? req.file.path : null;
            const berita = await db.Berita.create({
                image: imagePath,
                title,
                content,
                date,
                author,
                user_id,
            });

            res.status(201).json({
                status: 'success',
                message: 'Berita berhasil ditambahkan',
                data: berita,
            });
        } catch (error) {
            console.error('Error creating berita:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menambahkan berita',
            });
        }
    },

    // Edit Berita (Admin Only)
    updateBerita: async (req, res) => {
        const { id } = req.params;
        const { title, content, date, author } = req.body;

        try {
            const berita = await db.Berita.findByPk(id);
            if (!berita) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Berita tidak ditemukan',
                });
            }

            // Update gambar jika ada file baru
            if (req.file) {
                berita.image = req.file.path;
            }

            // Update field lainnya
            berita.title = title || berita.title;
            berita.content = content || berita.content;
            berita.date = date || berita.date;
            berita.author = author || berita.author;

            await berita.save();

            res.status(200).json({
                status: 'success',
                message: 'Berita berhasil diperbarui',
                data: berita,
            });
        } catch (error) {
            console.error('Error updating berita:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat memperbarui berita',
            });
        }
    },

    // Delete Berita (Admin Only)
    deleteBerita: async (req, res) => {
        const { id } = req.params;

        try {
            const berita = await db.Berita.findByPk(id);
            if (!berita) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Berita tidak ditemukan',
                });
            }

            await berita.destroy();

            res.status(200).json({
                status: 'success',
                message: 'Berita berhasil dihapus',
            });
        } catch (error) {
            console.error('Error deleting berita:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menghapus berita',
            });
        }
    },

    // Lihat Semua Berita untuk User/Public
    getAllBerita: async (req, res) => {
        try {
            const beritaList = await db.Berita.findAll({
                attributes: ['id', 'image', 'title', 'content', 'date', 'author'],
                order: [['date', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                message: 'Semua berita berhasil diambil',
                data: beritaList,
            });
        } catch (error) {
            console.error('Error retrieving berita list:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil berita',
            });
        }
    },

    // Lihat Detail Berita untuk Public
    getBeritaPublic: async (req, res) => {
        const { id } = req.params;

        try {
            const berita = await db.Berita.findByPk(id, {
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username'],
                }],
            });

            if (!berita) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Berita tidak ditemukan',
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Detail berita berhasil diambil',
                data: berita,
            });
        } catch (error) {
            console.error('Error retrieving berita:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil detail berita',
            });
        }
    },

    // get SUmmary Berita
    getSummaryBerita: async (req, res) => {
        try {
            // Menghitung total berita
            const totalBerita = await db.Berita.count();

            // Mengirim respons dengan ringkasan data
            res.status(200).json({
                status: 'success',
                message: 'Ringkasan berita berhasil diambil',
                data: {
                    totalBerita,
                },
            });
        } catch (error) {
            console.error('Error retrieving berita summary:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil ringkasan berita',
            });
        }
    },

};

module.exports = BeritaController;
