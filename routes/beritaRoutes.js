const express = require('express');
const router = express.Router();
const beritaController = require('../controllers/beritaController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Routes for Admin (protected with JWT)
router.post('/add-berita', verifyToken, beritaController.createBerita);
router.put('/berita/:id', verifyToken, beritaController.updateBerita);
router.delete('/berita/:id', verifyToken, beritaController.deleteBerita);
router.get('/berita/:id', verifyToken, beritaController.getBerita);

// Routes for Public View (no JWT required)
router.get('/beritas', beritaController.getAllBerita);
router.get('/berita-public/:id', beritaController.getBeritaPublic);

module.exports = router;
