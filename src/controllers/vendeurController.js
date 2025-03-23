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

        console.log(parseInt(req.user.userId))
        // Create a new user
        await Product.create({
            userId: parseInt(req.user.userId),
            productName,
            productImage,
            productPrice:parseInt(productPrice),
            productType,
        });

        res.status(200).json({
            message: 'Login successful',
            result: { userId:req.user.userId,productName, productImage,productPrice:parseInt(productPrice),productType },
        });
    } catch (error) {
        next(error);
    }
};




exports.afficherProduitParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user

        // Extract pagination parameters from query (default: page=1, size=10)
        let { page, size } = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;

        if (page < 1 || size < 1) {
            return res.status(400).json({ message: "Page and size must be positive numbers" });
        }

        // Calculate offset
        const offset = (page - 1) * size;

        // Fetch products with pagination
        const { rows: products, count: totalItems } = await Product.findAndCountAll({
            where: { userId },
            limit: size,
            offset: offset,
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this user" });
        }

        res.status(200).json({
            message: "Products retrieved successfully",
            result: products,
            pagination: {
                currentPage: page,
                pageSize: size,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / size),
            },
        });
    } catch (error) {
        next(error);
    }
};

