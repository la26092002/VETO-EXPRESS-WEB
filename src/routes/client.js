const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate, isClient } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, isClient, clientController.creerServiceVente);
router.post('/creerServiceConsultation', verifyToken, isValidate, isClient, clientController.creerServiceConsultation);

router.get('/getVendeurs', verifyToken, isValidate, isClient, clientController.getVendeurs);
router.get('/getDocteurs', verifyToken, isValidate, isClient, clientController.getDocteurs);



module.exports = router;