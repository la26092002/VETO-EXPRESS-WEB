const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, clientController.creerServiceVente);
router.post('/creerServiceConsultation', verifyToken, isValidate, clientController.creerServiceConsultation);

router.get('/getVendeurs', verifyToken, isValidate, clientController.getVendeurs);
router.get('/getDocteurs', verifyToken, isValidate, clientController.getDocteurs);



module.exports = router;