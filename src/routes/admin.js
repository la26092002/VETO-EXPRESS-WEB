const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isValidate, isAdmin, isBan } = require('../middlewares/authMiddleware');


router.get('/AfficherUsers', verifyToken, isValidate,isAdmin,  isBan, adminController.AfficherUsers);
router.put('/BanUser', verifyToken, isValidate,isAdmin, isBan, adminController.BanUser);

module.exports = router;