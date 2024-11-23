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
                    src: file.path,
                    caption: '' // Optional: Bisa diisi sesuai kebutuhan
                });
            });

            // Tunggu semua gambar selesai dibuat
            imageData = await Promise.all(imagePromises);
        }

        res.status(201).json({
            status: 'success',
            message: 'Album and images successfully created',
            data: {
                album: {
                    id: album.id,
                    title: album.title,
                    description: album.description,
                    images: imageData.map((image) => ({
                        id: image.id,
                        src: image.src,
                        caption: image.caption,
                    })),
                },
            },
        });
    } catch (error) {
        console.error('Error creating album with images:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while creating the album',
        });
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
                    attributes: ['id', 'src', 'caption'],
                },
            ],
            attributes: ['id', 'title', 'description'],
        });

        res.status(200).json({
            status: 'success',
            message: 'Albums retrieved successfully',
            data: albums,
        });
    } catch (error) {
        console.error('Error retrieving albums:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while retrieving the albums',
        });
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
                    attributes: ['id', 'src', 'caption'],
                },
            ],
        });

        if (!album) {
            return res.status(404).json({
                status: 'fail',
                message: 'Album not found',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Album retrieved successfully',
            data: album,
        });
    } catch (error) {
        console.error('Error retrieving album:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while retrieving the album',
        });
    }
};


// 4. Memperbarui album dan foto-fotonya berdasarkan ID (Admin Only)
exports.updateAlbumWithImages = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const album = await db.Album.findByPk(id, {
            include: [{ model: db.Image, as: 'images' }],
        });

        if (!album) {
            return res.status(404).json({
                status: 'fail',
                message: 'Album not found',
            });
        }

        // Perbarui informasi album
        album.title = title || album.title;
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
                caption: '',
            }));

            await db.Image.bulkCreate(newImages);
        }

        // Ambil album terbaru dengan gambar yang diperbarui
        const updatedAlbum = await db.Album.findByPk(album.id, {
            include: [{ model: db.Image, as: 'images', attributes: ['id', 'src', 'caption'] }],
        });

        res.status(200).json({
            status: 'success',
            message: 'Album successfully updated',
            data: updatedAlbum,
        });
    } catch (error) {
        console.error('Error updating album:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while updating the album',
        });
    }
};


// 5. Menghapus album beserta foto-fotonya berdasarkan ID (Admin Only)
exports.deleteAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        const album = await db.Album.findByPk(id);

        if (!album) {
            return res.status(404).json({
                status: 'fail',
                message: 'Album not found',
            });
        }

        await album.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Album and associated images successfully deleted',
        });
    } catch (error) {
        console.error('Error deleting album:', error);
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while deleting the album',
        });
    }
};

