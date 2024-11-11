const db = require('../models');

// 1. Menambahkan album beserta foto-foto di dalamnya (Admin Only)
exports.createAlbumWithImages = async (req, res) => {
    const { title, description, images } = req.body; // `images` adalah array foto-foto yang akan ditambahkan

    try {
        // Buat album baru
        const album = await db.Album.create({ title, description });

        // Jika ada foto-foto yang dikirimkan, tambahkan ke album
        if (images && Array.isArray(images)) {
            const imagePromises = images.map((image) => {
                return db.Image.create({
                    album_id: album.id,
                    src: image.src,
                    caption: image.caption
                });
            });
            await Promise.all(imagePromises);
        }

        // Ambil album lengkap beserta foto-fotonya untuk response
        const fullAlbum = await db.Album.findByPk(album.id, {
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['src', 'caption']
                }
            ]
        });

        res.status(201).json({
            message: 'Album dan foto-foto berhasil ditambahkan',
            data: fullAlbum
        });
    } catch (error) {
        console.error('Error creating album with images:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan album dan foto' });
    }
};

// 2. Mendapatkan semua album beserta foto-fotonya (untuk publik)
exports.getAllAlbums = async (req, res) => {
    try {
        const albums = await db.Album.findAll({
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['src', 'caption']
                }
            ],
            attributes: ['id', 'title', 'description']
        });
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error retrieving albums:', error);
        res.status(500).json({ message: 'Error retrieving albums' });
    }
};

// 3. Mendapatkan detail album berdasarkan ID beserta foto-fotonya (untuk publik dan admin)
exports.getAlbumById = async (req, res) => {
    const { id } = req.params;

    try {
        const album = await db.Album.findByPk(id, {
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['src', 'caption']
                }
            ]
        });
        if (!album) {
            return res.status(404).json({ message: 'Album tidak ditemukan' });
        }
        res.status(200).json(album);
    } catch (error) {
        console.error('Error retrieving album:', error);
        res.status(500).json({ message: 'Error retrieving album' });
    }
};

// 4. Memperbarui album dan foto-fotonya berdasarkan ID (Admin Only)
exports.updateAlbumWithImages = async (req, res) => {
    const { id } = req.params;
    const { title, description, images } = req.body;

    try {
        const album = await db.Album.findByPk(id);
        if (!album) {
            return res.status(404).json({ message: 'Album tidak ditemukan' });
        }

        // Perbarui informasi album
        album.title = title;
        album.description = description;
        await album.save();

        // Hapus foto-foto lama
        await db.Image.destroy({ where: { album_id: album.id } });

        // Tambahkan foto-foto baru
        if (images && Array.isArray(images)) {
            const imagePromises = images.map((image) => {
                return db.Image.create({
                    album_id: album.id,
                    src: image.src,
                    caption: image.caption
                });
            });
            await Promise.all(imagePromises);
        }

        // Ambil album lengkap beserta foto-fotonya untuk response
        const updatedAlbum = await db.Album.findByPk(album.id, {
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['src', 'caption']
                }
            ]
        });

        res.status(200).json({
            message: 'Album dan foto-foto berhasil diperbarui',
            data: updatedAlbum
        });
    } catch (error) {
        console.error('Error updating album with images:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui album dan foto' });
    }
};

// 5. Menghapus album beserta foto-fotonya berdasarkan ID (Admin Only)
exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        const album = await db.Album.findByPk(id);
        if (!album) {
            return res.status(404).json({ message: 'Album tidak ditemukan' });
        }

        await album.destroy();
        res.status(200).json({ message: 'Album dan foto-foto terkait berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).json({ message: 'Error deleting album' });
    }
};
