const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/album', authMiddleware.verifyToken, albumController.createAlbumWithImages);
router.put('/album/:id', authMiddleware.verifyToken, albumController.updateAlbumWithImages);
router.delete('/album/:id', authMiddleware.verifyToken, albumController.deleteAlbum);

router.get('/album', albumController.getAllAlbums);
router.get('/album/:id', albumController.getAlbumById);

module.exports = router;
