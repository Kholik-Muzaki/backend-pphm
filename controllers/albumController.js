const db = require('../models');

// 1. Menambahkan album beserta foto-foto di dalamnya (Admin Only)
exports.createAlbumWithImages = async (req, res) => {
    const { title, description } = req.body;

    try {
        // Buat album baru
        const album = await db.Album.create({ title, description });

        // Tambahkan file gambar jika ada
        let imageData = [];
        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map((file) => {
                return db.Image.create({
                    album_id: album.id,
                    src: file.path, // Path file gambar
                    caption: '' // Optional: Bisa diisi sesuai kebutuhan
                });
            });

            // Tunggu semua gambar selesai dibuat
            imageData = await Promise.all(imagePromises);
        }

        // Ambil album lengkap beserta foto-fotonya untuk response
        const fullAlbum = {
            id: album.id,
            title: album.title,
            description: album.description,
            images: imageData.map((image) => ({
                id: image.id,       // Sertakan id gambar
                src: image.src,     // Path gambar
                caption: image.caption // Caption gambar
            }))
        };

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
    const { id } = req.params; // ID album diambil dari URL params
    const { title, description } = req.body;

    try {
        // Cari album berdasarkan ID
        const album = await db.Album.findByPk(id, {
            include: [{ model: db.Image, as: 'images' }]
        });

        if (!album) {
            return res.status(404).json({ message: 'Album tidak ditemukan' });
        }

        // Perbarui informasi album
        album.title = title || album.title; // Jika tidak ada input, tetap gunakan data lama
        album.description = description || album.description;
        await album.save();

        // Jika ada file gambar yang diunggah
        if (req.files && req.files.length > 0) {
            // Hapus semua gambar lama terkait album
            await db.Image.destroy({ where: { album_id: album.id } });

            // Tambahkan gambar baru
            const newImages = req.files.map((file) => ({
                album_id: album.id,
                src: file.path,
                caption: '' // Optional: Bisa diisi sesuai kebutuhan
            }));

            // Simpan gambar baru ke database
            await db.Image.bulkCreate(newImages);
        }

        // Ambil album terbaru dengan gambar yang diperbarui
        const updatedAlbum = await db.Album.findByPk(album.id, {
            include: [{ model: db.Image, as: 'images', attributes: ['id', 'src', 'caption'] }]
        });

        res.status(200).json({
            message: 'Album berhasil diperbarui',
            data: updatedAlbum
        });
    } catch (error) {
        console.error('Error updating album:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui album' });
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
