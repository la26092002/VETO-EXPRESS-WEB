const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords
const Product = require('../models/product');
const { Acteur } = require('../constants/Enums');


exports.ajouterProduit = async (req, res, next) => {
    try {
        const { productName,
            productImage,
            productPrice,
            productType } = req.body;

        if (req.user.typeActeur !== Acteur.Vendeur){
            return res.status(401).json({ message: 'Just seller have access to add product' });
        }

        // Check if user exists
        if (!productName || !productImage || !productPrice || !productType ) {
            return res.status(401).json({ message: 'Invalid productName, productImage, productPrice or productType' });
        }

        // Create a new user
        const product = await Product.create({
            userId:req.user.userId,
            productName,
            productImage,
            productPrice,
            productType,
        });

        res.status(200).json({
            message: 'Login successful',
            result: { userId,productName, productImage,productPrice,productType },
        });
    } catch (error) {
        next(error);
    }
};