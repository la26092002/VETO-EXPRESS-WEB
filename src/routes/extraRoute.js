const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livrreurController');
const { verifyToken, isValidate, isClient, isBan, isLivreur } = require('../middlewares/authMiddleware');


// router.get('/AfficherServiceConsultations', verifyToken, isValidate, isLivreur, isBan, livreurController.AfficherServiceConsultations);



module.exports = router;