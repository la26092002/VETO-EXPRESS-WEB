// controllers/authController.js
const MyAccount = require('../models/myAccount');
const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
        const user = await MyAccount.create({
            email, 
            password: hashedPassword
        });
        res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) throw { name: "Email is required" };
        if (!password) throw { name: "Password is required" };

        const user = await MyAccount.findOne({ where: { email } });
        if (!user) throw { name: "Invalid email/password" };

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw { name: "Invalid email/password" };

        const access_token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
        res.status(200).json({ access_token });
    } catch (error) {
        next(error);
    }
};
