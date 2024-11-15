const db = require('../models');

// Tambah artikel
exports.createArtikel = async (req, res) => {
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
            message: 'Artikel berhasil ditambahkan',
            data: artikel
        });
    } catch (error) {
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan artikel',
        })
    }
}

// Edit Artikel
exports.updateArtikel = async (req, res) => {
    const { id } = req.params;
    const { title, content, date, author } = req.body;

    try {
        const artikel = await db.Artikel.findByPk(id);
        if (!artikel) {
            return res.status(404).json({
                message: 'Artikel tidak ditemukan'
            });
        }

        // Jika ada file yang di-upload, ganti path image dengan file baru
        if (req.file) {
            artikel.image = req.file.path;
        }

        // Perbarui field lainnya
        artikel.title = title;
        artikel.content = content;
        artikel.date = date;
        artikel.author = author;

        await artikel.save();
        res.status(200).json({
            message: 'Artikel berhasil diperbarui',
            data: artikel
        });
    } catch (error) {
        console.error('Error updating artikel:', error);
        res.status(500).json({
            message: 'Error updating artikel'
        });
    }
};

// Delete Artikel
exports.deleteArtikel = async (req, res) => {
    const { id } = req.params;

    try {
        const artikel = await db.Artikel.findByPk(id);
        if (!artikel) {
            return res.status(404).json({
                message: 'Artikel tidak ditemukan'
            });
        }

        await artikel.destroy();
        res.status(200).json({
            message: 'Artikel berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting artikel:', error);
        res.status(500).json({
            message: 'Error deleting artikel'
        });
    }
}

// Lihat Semua Artikel untuk User (tanpa login)
exports.getAllArtikel = async (req, res) => {
    try {
        const artikels = await db.Artikel.findAll({
            attributes: ['id', 'image', 'title', 'content', 'date', 'author'],
            order: [['date', 'DESC']]
        });
        res.status(200).json(artikels);
    } catch (error) {
        console.error('Error retrieving artikels:', error);
        res.status(500).json({ message: 'Error retrieving artikels' });
    }
};

// Lihat Detail Artikel Tanpa Autentikasi (untuk User/Public)
exports.getArtikelPublic = async (req, res) => {
    const { id } = req.params;

    try {
        const artikel = await db.Artikel.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username']
            }]
        });
        if (!artikel) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }
        res.status(200).json(artikel);
    } catch (error) {
        console.error('Error retrieving artikel:', error);
        res.status(500).json({ message: 'Error retrieving artikel' });
    }
};
