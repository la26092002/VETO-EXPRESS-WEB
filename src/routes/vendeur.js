const express = require('express');
const router = express.Router();
const vendeurController = require('../controllers/vendeurController');
const { verifyToken, isValidate, isVendeur } = require('../middlewares/authMiddleware');

router.post('/ajouterProduit', verifyToken, isValidate, isVendeur, vendeurController.ajouterProduit);
router.get('/afficherProduitsParUser', verifyToken, isValidate,  isVendeur, vendeurController.afficherProduitParUser);
router.put('/modifierProduit/:productId', verifyToken, isValidate,  isVendeur, vendeurController.modifierProduit);
router.delete('/supprimerProduit/:productId', verifyToken, isValidate,  isVendeur, vendeurController.supprimerProduit);

router.get('/afficherServiceVenteParUser', verifyToken, isValidate,  isVendeur, vendeurController.afficherServicesVenteParUser);
router.put('/modifierStatusServicesVenteParUser', verifyToken, isValidate,  isVendeur, vendeurController.modifierStatusServicesVenteParUser);

module.exports = router;