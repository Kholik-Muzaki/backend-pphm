const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/video', authMiddleware.verifyToken, videoController.createVideo);
router.put('/video/:id', authMiddleware.verifyToken, videoController.updateVideo);
router.delete('/video/:id', authMiddleware.verifyToken, videoController.deleteVideo);

router.get('/video', videoController.getAllVideos);
router.get('/video/:id', videoController.getVideoPublic);

module.exports = router;
