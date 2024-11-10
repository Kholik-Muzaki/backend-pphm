const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware autentikasi

// Tambah Data Keuangan
router.post('/keuangan', verifyToken, keuanganController.createKeuangan);

// Lihat Detail Data Keuangan
router.get('/keuangan/:id', verifyToken, keuanganController.getKeuangan);

// Edit Data Keuangan
router.put('/keuangan/:id', verifyToken, keuanganController.updateKeuangan);

// Hapus Data Keuangan
router.delete('/keuangan/:id', verifyToken, keuanganController.deleteKeuangan);

module.exports = router;
