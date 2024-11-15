const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/beritaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Routes
router.post('/berita', verifyToken,upload.single('image'), beritaController.createBerita);
router.put('/berita/:id', verifyToken, upload.single('image'), beritaController.updateBerita);
router.delete('/berita/:id', verifyToken, beritaController.deleteBerita);

router.get('/berita', beritaController.getAllBerita);
router.get('/berita/:id', beritaController.getBeritaPublic);

module.exports = router;
