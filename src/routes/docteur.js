const express = require('express');
const router = express.Router();
const docteurController = require('../controllers/docteurController');
const { verifyToken, isValidate, isDocteur, isBan } = require('../middlewares/authMiddleware');


router.get('/afficherServiceConsultationParUser', verifyToken, isValidate, isDocteur, isBan, docteurController.afficherServiceConsultationParUser);
router.put('/modifierServiceConsultationParUser', verifyToken, isValidate, isDocteur, isBan, docteurController.modifierServiceConsultationParUser);

module.exports = router;