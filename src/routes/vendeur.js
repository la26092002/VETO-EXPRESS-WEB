const express = require('express');
const router = express.Router();
const vendeurController = require('../controllers/vendeurController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/ajouterProduit', verifyToken, isValidate, vendeurController.ajouterProduit);
router.get('/afficherProduitsParUser', verifyToken, isValidate, vendeurController.afficherProduitParUser);
router.put('/modifierProduit/:productId', verifyToken, isValidate, vendeurController.modifierProduit);
router.delete('/supprimerProduit/:productId', verifyToken, isValidate, vendeurController.supprimerProduit);

router.get('/afficherServiceVente', verifyToken, isValidate);
router.get('/confirmerRefuserServiceVente', verifyToken, isValidate);

module.exports = router;