const db = require('../models');

// Controller Video
const VideoController = {
    // Tambah Video (Admin Only)
    createVideo: async (req, res) => {
        const { link, judul } = req.body;
        const user_id = req.user.id;

        try {
            const video = await db.Video.create({
                link,
                judul,
                user_id,
            });

            res.status(201).json({
                status: 'success',
                message: 'Video berhasil ditambahkan',
                data: video,
            });
        } catch (error) {
            console.error('Error creating video:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menambahkan video',
            });
        }
    },

    // Edit Video (Admin Only)
    updateVideo: async (req, res) => {
        const { id } = req.params;
        const { link, judul } = req.body;

        try {
            const video = await db.Video.findByPk(id);
            if (!video) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Video tidak ditemukan',
                });
            }

            video.link = link || video.link;
            video.judul = judul || video.judul;

            await video.save();

            res.status(200).json({
                status: 'success',
                message: 'Video berhasil diperbarui',
                data: video,
            });
        } catch (error) {
            console.error('Error updating video:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat memperbarui video',
            });
        }
    },

    // Hapus Video (Admin Only)
    deleteVideo: async (req, res) => {
        const { id } = req.params;

        try {
            const video = await db.Video.findByPk(id);
            if (!video) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Video tidak ditemukan',
                });
            }

            await video.destroy();

            res.status(200).json({
                status: 'success',
                message: 'Video berhasil dihapus',
            });
        } catch (error) {
            console.error('Error deleting video:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat menghapus video',
            });
        }
    },

    // Lihat Semua Video untuk Pengunjung (Tanpa Login)
    getAllVideos: async (req, res) => {
        try {
            const videoList = await db.Video.findAll({
                attributes: ['id', 'link', 'judul', 'user_id'],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                message: 'Semua video berhasil diambil',
                data: videoList,
            });
        } catch (error) {
            console.error('Error retrieving video list:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil daftar video',
            });
        }
    },

    // Lihat Semua Video untuk Admin (Dengan Login)
    getAllVideosAdmin: async (req, res) => {
        try {
            const videoList = await db.Video.findAll({
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username', 'role'],
                }],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                message: 'Semua video berhasil diambil untuk admin',
                data: videoList,
            });
        } catch (error) {
            console.error('Error retrieving video list for admin:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil daftar video untuk admin',
            });
        }
    },

    // Lihat Detail Video Tanpa Login (Untuk Pengunjung/Public)
    getVideoPublic: async (req, res) => {
        const { id } = req.params;

        try {
            const video = await db.Video.findByPk(id, {
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['username'],
                }],
            });

            if (!video) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Video tidak ditemukan',
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Detail video berhasil diambil',
                data: video,
            });
        } catch (error) {
            console.error('Error retrieving video:', error);
            res.status(500).json({
                status: 'error',
                message: 'Terjadi kesalahan saat mengambil detail video',
            });
        }
    },
};

module.exports = VideoController;
