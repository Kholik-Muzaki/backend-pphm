const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganController');
const { verifyToken } = require('../middlewares/authMiddleware'); 


router.post('/keuangan', verifyToken, keuanganController.createKeuangan);
router.get('/keuangan/:id', verifyToken, keuanganController.getKeuangan);
router.put('/keuangan/:id', verifyToken, keuanganController.updateKeuangan);
router.delete('/keuangan/:id', verifyToken, keuanganController.deleteKeuangan);
router.get('/keuangan', verifyToken, keuanganController.getAllKeuangan);
router.get('/keuanganSummary', verifyToken, keuanganController.getSummary);

module.exports = router;
