const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/creerServiceVente', verifyToken, isValidate, clientController.creerService);


module.exports = router;