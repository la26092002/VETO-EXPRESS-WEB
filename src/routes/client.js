const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, clientController.creerServiceVente);
router.post('/creerServiceConsultation', verifyToken, isValidate, clientController.creerServiceConsultation);


module.exports = router;