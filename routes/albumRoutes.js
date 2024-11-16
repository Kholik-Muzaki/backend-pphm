const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');


router.post('/album', authMiddleware.verifyToken, upload.array('images', 10), albumController.createAlbumWithImages);
router.put('/album/:id', authMiddleware.verifyToken, upload.array('images', 10), albumController.updateAlbumWithImages);
router.delete('/album/:id', authMiddleware.verifyToken, albumController.deleteAlbum);

router.get('/album', albumController.getAllAlbums);
router.get('/album/:id', albumController.getAlbumById);

module.exports = router;
