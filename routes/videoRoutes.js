const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint untuk pengguna umum (tanpa login)
router.get('/videos-public', videoController.getAllVideos); // Get all videos untuk pengunjung
router.get('/video-public/:id', videoController.getVideoPublic); // Get detail video berdasarkan ID untuk pengunjung

// Endpoint untuk admin (dengan login dan verifikasi JWT)
router.get('/videos', authMiddleware.verifyToken, videoController.getAllVideosAdmin); // Get all videos untuk admin
router.post('/video', authMiddleware.verifyToken, videoController.createVideo); // Tambah video baru
router.put('/video/:id', authMiddleware.verifyToken, videoController.updateVideo); // Edit video berdasarkan ID
router.delete('/video/:id', authMiddleware.verifyToken, videoController.deleteVideo); // Hapus video berdasarkan ID

module.exports = router;
