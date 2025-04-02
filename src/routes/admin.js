const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isValidate, isAdmin } = require('../middlewares/authMiddleware');


router.get('/AfficherUsers', verifyToken, isValidate,isAdmin, adminController.AfficherUsers);



module.exports = router;