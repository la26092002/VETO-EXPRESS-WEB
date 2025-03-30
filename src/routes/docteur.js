const express = require('express');
const router = express.Router();
const docteurController = require('../controllers/docteurController');
const { verifyToken, isValidate, isDocteur } = require('../middlewares/authMiddleware');


router.get('/afficherServiceConsultationParUser', verifyToken, isValidate, isDocteur, docteurController.afficherServiceConsultationParUser);
router.put('/modifierStatusServiceConsultationParUser', verifyToken, isValidate, isDocteur, docteurController.modifierStatusServiceConsultationParUser);

module.exports = router;