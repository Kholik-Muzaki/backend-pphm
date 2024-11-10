const express = require('express');
const router = express.Router();
const artikelController = require('../controllers/artikelController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware autentikasi

// Route untuk Admin (dengan autentikasi)
router.post('/artikel', verifyToken, artikelController.createArtikel);
router.get('/artikel/:id', verifyToken, artikelController.getArtikel);
router.put('/artikel/:id', verifyToken, artikelController.updateArtikel);
router.delete('/artikel/:id', verifyToken, artikelController.deleteArtikel);

// Route untuk User (tanpa autentikasi)
router.get('/artikels', artikelController.getAllArtikel);
router.get('/artikel-public/:id', artikelController.getArtikelPublic); // Detail artikel tanpa autentikasi

module.exports = router;
