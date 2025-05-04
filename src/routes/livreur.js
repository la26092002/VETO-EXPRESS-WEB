const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livrreurController');
const { verifyToken, isValidate, isClient, isBan, isLivreur } = require('../middlewares/authMiddleware');


router.get('/AfficherServiceConsultations', verifyToken, isValidate, isLivreur, isBan, livreurController.AfficherServiceConsultations);
router.put('/modifierStatusServicesConsultationsParUser', verifyToken, isValidate, isLivreur, isBan, livreurController.modifierStatusServicesVenteParUser);


router.get('/AfficherServiceVente', verifyToken, isValidate, isLivreur, isBan, livreurController.AfficherServiceVente);
router.put('/modifierStatusServicesVenteParUser', verifyToken, isValidate, isLivreur, isBan, livreurController.modifierStatusServicesVenteParUser);



module.exports = router;