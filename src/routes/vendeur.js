const express = require('express');
const router = express.Router();
const vendeurController = require('../controllers/vendeurController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/ajouterProduit', verifyToken, isValidate,vendeurController.ajouterProduit);
router.post('/modifierProduit', authController.login);
router.get('/supprimerProduit', verifyToken, authController.getMe);
router.get('/afficherProduits', verifyToken, authController.getMe);

router.get('/afficherServiceVente', verifyToken, authController.getMe);
router.get('/confirmerRefuserServiceVente', verifyToken, authController.getMe);

module.exports = router;