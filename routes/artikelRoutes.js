const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const ArtikelController = require('../controllers/artikelController');

router.post('/artikel', verifyToken, upload.single('image'), ArtikelController.createArtikel);
router.put('/artikel/:id', verifyToken, upload.single('image'), ArtikelController.updateArtikel);
router.delete('/artikel/:id', verifyToken, ArtikelController.deleteArtikel);

router.get('/artikel', ArtikelController.getAllArtikel);
router.get('/artikel/:id', ArtikelController.getArtikelPublic);

module.exports = router;
