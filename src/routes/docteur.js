const express = require('express');
const router = express.Router();
const docteurController = require('../controllers/docteurController');
const { verifyToken, isValidate, isDocteur } = require('../middlewares/authMiddleware');


router.get('/afficherServiceConsultationParUser', verifyToken, isValidate, isDocteur, docteurController.afficherServiceConsultationParUser);
router.put('/modifierServiceConsultationParUser', verifyToken, isValidate, isDocteur, docteurController.modifierServiceConsultationParUser);

module.exports = router;