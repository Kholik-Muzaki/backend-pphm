const express = require('express');
const router = express.Router();
const artikelController = require('../controllers/artikelController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/artikel', verifyToken, upload.single('image'), artikelController.createArtikel);
router.put('/artikel/:id', verifyToken, upload.single('image'), artikelController.updateArtikel);
router.delete('/artikel/:id', verifyToken, artikelController.deleteArtikel);

router.get('/artikel', artikelController.getAllArtikel);
router.get('/artikel/:id', artikelController.getArtikelPublic);

module.exports = router;
