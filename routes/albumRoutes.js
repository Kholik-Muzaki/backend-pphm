const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint untuk publik (tanpa login)
router.get('/albums', albumController.getAllAlbums); // Mendapatkan semua album beserta foto-fotonya
router.get('/album-public/:id', albumController.getAlbumById); // Mendapatkan detail album berdasarkan ID

// Endpoint untuk admin (dengan login dan verifikasi JWT)
router.post('/album', authMiddleware.verifyToken, albumController.createAlbumWithImages); // Tambah album beserta foto-foto
router.put('/album/:id', authMiddleware.verifyToken, albumController.updateAlbumWithImages); // Perbarui album beserta foto-foto berdasarkan ID
router.delete('/album/:id', authMiddleware.verifyToken, albumController.deleteAlbum); // Hapus album beserta foto-foto berdasarkan ID

module.exports = router;
