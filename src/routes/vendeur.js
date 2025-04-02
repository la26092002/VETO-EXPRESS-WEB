const express = require('express');
const router = express.Router();
const vendeurController = require('../controllers/vendeurController');
const { verifyToken, isValidate, isVendeur, isBan } = require('../middlewares/authMiddleware');

router.post('/ajouterProduit', verifyToken, isValidate, isVendeur,  isBan, vendeurController.ajouterProduit);
router.get('/afficherProduitsParUser', verifyToken, isValidate,  isVendeur, isBan, vendeurController.afficherProduitParUser);
router.put('/modifierProduit/:productId', verifyToken, isValidate,  isVendeur, isBan, vendeurController.modifierProduit);
router.delete('/supprimerProduit/:productId', verifyToken, isValidate,  isVendeur, isBan, vendeurController.supprimerProduit);

router.get('/afficherServiceVenteParUser', verifyToken, isValidate,  isVendeur, isBan, vendeurController.afficherServicesVenteParUser);
router.put('/modifierStatusServicesVenteParUser', verifyToken, isValidate,  isVendeur, isBan, vendeurController.modifierStatusServicesVenteParUser);

module.exports = router;