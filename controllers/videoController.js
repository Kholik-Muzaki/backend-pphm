const db = require('../models');

// Tambah Video (Admin only)
exports.createVideo = async (req, res) => {
    const { link, judul } = req.body;
    const user_id = req.user.id;

    try {
        const video = await db.Video.create({
            link,
            judul,
            user_id
        });
        res.status(201).json({
            message: 'Video berhasil ditambahkan',
            data: video
        });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan video'
        });
    }
};

// Lihat Detail Video (Admin only)
exports.getVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await db.Video.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username', 'role']
            }]
        });
        if (!video) {
            return res.status(404).json({
                message: 'Video tidak ditemukan'
            });
        }
        res.status(200).json(video);
    } catch (error) {
        console.error('Error retrieving video:', error);
        res.status(500).json({
            message: 'Error retrieving video'
        });
    }
};

// Edit Video (Admin only)
exports.updateVideo = async (req, res) => {
    const { id } = req.params;
    const { link, judul } = req.body;

    try {
        const video = await db.Video.findByPk(id);
        if (!video) {
            return res.status(404).json({
                message: 'Video tidak ditemukan'
            });
        }

        video.link = link;
        video.judul = judul;

        await video.save();
        res.status(200).json({
            message: 'Video berhasil diperbarui',
            data: video
        });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({
            message: 'Error updating video'
        });
    }
};

// Delete Video (Admin only)
exports.deleteVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await db.Video.findByPk(id);
        if (!video) {
            return res.status(404).json({
                message: 'Video tidak ditemukan'
            });
        }

        await video.destroy();
        res.status(200).json({
            message: 'Video berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({
            message: 'Error deleting video'
        });
    }
};

// Lihat Semua Video untuk Pengunjung (tanpa login)
exports.getAllVideos = async (req, res) => {
    try {
        const videoList = await db.Video.findAll({
            attributes: ['id', 'link', 'judul', 'user_id'],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(videoList);
    } catch (error) {
        console.error('Error retrieving video list:', error);
        res.status(500).json({ message: 'Error retrieving videos' });
    }
};

// Lihat Semua Video untuk Admin (dengan login)
exports.getAllVideosAdmin = async (req, res) => {
    try {
        const videoList = await db.Video.findAll({
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username', 'role']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(videoList);
    } catch (error) {
        console.error('Error retrieving video list for admin:', error);
        res.status(500).json({ message: 'Error retrieving videos for admin' });
    }
};

// Lihat Detail Video Tanpa Autentikasi (untuk Pengunjung/Public)
exports.getVideoPublic = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await db.Video.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['username']
            }]
        });
        if (!video) {
            return res.status(404).json({
                message: 'Video tidak ditemukan'
            });
        }
        res.status(200).json(video);
    } catch (error) {
        console.error('Error retrieving video:', error);
        res.status(500).json({
            message: 'Error retrieving video'
        });
    }
};
