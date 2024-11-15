const db = require('../models');

// Tambah berita (Admin only)
exports.createBerita = async (req, res) => {
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
            user_id
        });
        res.status(201).json({
            message: 'Berita berhasil ditambahkan',
            data: berita
        });
    } catch (error) {
        console.error('Error creating berita:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan berita'
        });
    }
};

// Edit Berita (Admin only)
exports.updateBerita = async (req, res) => {
    const { id } = req.params;
    const { title, content, date, author } = req.body;

    try {
        const berita = await db.Berita.findByPk(id);
        if (!berita) {
            return res.status(404).json({
                message: 'Berita tidak ditemukan'
            });
        }

        //  jika ada file yang di-upload, ganti path image dengan file baru
        if (req.file) {
            berita.image = req.file.path;
        }

        // perbarui field lainnya
        berita.title = title;
        berita.content = content;
        berita.date = date;
        berita.author = author;

        await berita.save();
        res.status(200).json({
            message: 'Berita berhasil diperbarui',
            data: berita
        });
    } catch (error) {
        console.error('Error updating berita:', error);
        res.status(500).json({
            message: 'Error updating berita'
        });
    }
};

// Delete Berita (Admin only)
exports.deleteBerita = async (req, res) => {
    const { id } = req.params;

    try {
        const berita = await db.Berita.findByPk(id);
        if (!berita) {
            return res.status(404).json({
                message: 'Berita tidak ditemukan'
            });
        }

        await berita.destroy();
        res.status(200).json({
            message: 'Berita berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting berita:', error);
        res.status(500).json({
            message: 'Error deleting berita'
        });
    }
};

exports.getAllBerita = async (req, res) => {
    try {
        const beritaList = await db.Berita.findAll({
            attributes: ['id', 'image', 'title', 'content', 'date', 'author'],
            order: [['date', 'DESC']]
        });
        res.status(200).json(beritaList);
    } catch (error) {
        console.error('Error retrieving berita list:', error);
        res.status(500).json({ message: 'Error retrieving berita' });
    }
};

// Lihat Detail Berita Tanpa Autentikasi (untuk Pengunjung/Public)
exports.getBeritaPublic = async (req, res) => {
    const { id } = req.params;

    try {
        const berita = await db.Berita.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username']
            }]
        });
        if (!berita) {
            return res.status(404).json({
                message: 'Berita tidak ditemukan'
            });
        }
        res.status(200).json(berita);
    } catch (error) {
        console.error('Error retrieving berita:', error);
        res.status(500).json({
            message: 'Error retrieving berita'
        });
    }
};
