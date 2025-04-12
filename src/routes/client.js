const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate, isClient, isBan } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, isClient,isBan, clientController.creerServiceVente);
router.get('/afficherServiceVenteClient', verifyToken, isValidate, isClient,isBan, clientController.afficherServiceVenteClient);

router.post('/creerServiceConsultation', verifyToken, isValidate, isClient,isBan, clientController.creerServiceConsultation);
router.get('/afficherServiceConsultationClient', verifyToken, isValidate, isClient,isBan, clientController.afficherServiceConsultationClient);

router.get('/getVendeurs', verifyToken, isValidate, isClient, isBan, clientController.getVendeurs);
router.get('/getDocteurs', verifyToken, isValidate, isClient, isBan, clientController.getDocteurs);


//deletePet  addPet
router.post('/addPet', verifyToken, isValidate, isClient, isBan, clientController.addPet);
router.delete('/deletePet/:petId', verifyToken, isValidate, isClient, isBan, clientController.deletePet);
router.get('/pets', verifyToken, isValidate, isClient, isBan, clientController.getPets);




module.exports = router;