// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords

const nodemailer = require('nodemailer');

exports.register = async (req, res, next) => {
    try {
        const { nom, nomEtablissement, adresseMap, email, password, telephone, businessActivity, typeActeur } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            nom,
            nomEtablissement,
            adresseMap,
            email,
            password: hashedPassword,
            telephone,
            businessActivity,
            isValidate: true, // Default is not validated false
            typeActeur,
        });

        // Generate JWT Token  isValidate: false must be false on production 
        const token = jwt.sign({ userId: user.userId, typeActeur: user.typeActeur, isValidate: true, ban: user.ban }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.userId, typeActeur: user.typeActeur },
            token,
        });
    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email ' });
        }
        console.log(user)

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid  password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.userId, typeActeur: user.typeActeur, isValidate: user.isValidate, ban: user.ban },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );


        res.status(200).json({
            message: 'Login successful',
            user: { id: user.userId, typeActeur: user.typeActeur, isValidate: user.isValidate, ban: user.ban },
            token,
        });
    } catch (error) {
        next(error);
    }
};


exports.getMe = async (req, res) => {

    // Fetch user from database (excluding password)
    const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user); // `req.user` is set by the middleware
};



exports.updateUser = async (req, res, next) => {
    try {

        const { password, newPassword, nom, nomEtablissement, adresseMap, telephone, businessActivity, Kbis, userLatitude, userLongitude, smsNotification, push_Notification, promotional_Notification } = req.body;
        const userId = req.user.userId; // Get user ID from the authenticated token

        // Find user by ID
        const user = await User.findByPk(userId, {
            attributes: password ? undefined : { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields (only update if provided in req.body)
        if (nom) user.nom = nom;
        if (nomEtablissement) user.nomEtablissement = nomEtablissement;
        if (adresseMap) user.adresseMap = adresseMap;
        if (telephone) user.telephone = telephone;
        if (businessActivity) user.businessActivity = businessActivity;
        if (Kbis) user.Kbis = Kbis;
        if (userLatitude) user.userLatitude = userLatitude;
        if (userLongitude) user.userLongitude = userLongitude;

        if (smsNotification) user.smsNotification = smsNotification;
        if (push_Notification) user.push_Notification = push_Notification;
        if (promotional_Notification) user.promotional_Notification = promotional_Notification;


        if (password && newPassword ) {
            //change password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
        }
        await user.save(); // Save changes

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        next(error);
    }
};








// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your App Password (not normal password)
    }
});


exports.sendValidationCode = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit code
        const validationCode = Math.floor(100000 + Math.random() * 900000);

        // Create a short-lived token (10 min expiration)
        const validationToken = jwt.sign(
            { email, validationCode },
            process.env.JWT_SECRETisValidate,
            { expiresIn: '10m' }
        );

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Account Validation Code",
            text: `Your validation code is: ${validationCode}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Validation code sent to email",
            validationToken // This token will be used for verification
        });

    } catch (error) {
        next(error);
    }
};



exports.validateAccount = async (req, res, next) => {
    try {
        const { validationToken, enteredCode } = req.body;

        // Verify Token
        jwt.verify(validationToken, process.env.JWT_SECRETisValidate, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid or expired validation token" });
            }

            const { email, validationCode } = decoded;

            // Check if the entered code matches
            if (parseInt(enteredCode) !== validationCode) {
                return res.status(400).json({ message: "Incorrect validation code" });
            }

            // Update the user's validation status in the database
            await User.update({ isValidate: true }, { where: { email } }); const updatedUser = await User.findOne({ where: { email } });
            return res.status(200).json({
                message: "Account successfully validated"
            });
        });

    } catch (error) {
        next(error);
    }
};



exports.changePassword = async (req, res, next) => {
    try {
        const { validationToken, enteredCode, newPassword } = req.body;

        // Verify Token
        jwt.verify(validationToken, process.env.JWT_SECRETisValidate, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid or expired validation token" });
            }

            const { email, validationCode } = decoded;

            // Check if the entered code matches
            if (parseInt(enteredCode) !== validationCode) {
                return res.status(400).json({ message: "Incorrect validation code" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update the user's validation status in the database
            await User.update({ password: hashedPassword }, { where: { email } });

            return res.status(200).json({ message: "Account successfully update password" });
        });

    } catch (error) {
        next(error);
    }
};



