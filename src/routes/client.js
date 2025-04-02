const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate, isClient, isBan } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, isClient,isBan, clientController.creerServiceVente);
router.post('/creerServiceConsultation', verifyToken, isValidate, isClient,isBan, clientController.creerServiceConsultation);

router.get('/getVendeurs', verifyToken, isValidate, isClient, isBan, clientController.getVendeurs);
router.get('/getDocteurs', verifyToken, isValidate, isClient, isBan, clientController.getDocteurs);



module.exports = router;