const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isValidate } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getMe);
router.put('/update', verifyToken, isValidate, authController.updateUser);

router.post('/send-validation-code', authController.sendValidationCode);
router.post('/validate-account', authController.validateAccount);
router.post('/change-password', authController.changePassword);



module.exports = router;
