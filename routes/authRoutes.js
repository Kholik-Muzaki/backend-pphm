const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Mengimpor middleware

// Route login
router.post('/login', authController.login);

// Route untuk update profil pengguna yang memerlukan autentikasi
router.put('/updateProfile', verifyToken, authController.updateProfile);

// route untuk get informasi user
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
