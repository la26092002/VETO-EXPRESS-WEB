const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords
const Product = require('../models/product');
const { Acteur, ProductType } = require('../constants/Enums');
const ServiceVente = require('../models/ServiceVente');


exports.ajouterProduit = async (req, res, next) => {
    try {
        const { productName,
            productImage,
            productPrice,
            productType } = req.body;

        if (req.user.typeActeur !== Acteur.Vendeur) {
            return res.status(401).json({ message: 'Just seller have access to add product' });
        }

        // Check if user exists
        if (!productName || !productImage || !productPrice || !productType) {
            return res.status(401).json({ message: 'Invalid productName, productImage, productPrice or productType' });
        }

        console.log(parseInt(req.user.userId))
        // Create a new user
        await Product.create({
            userId: parseInt(req.user.userId),
            productName,
            productImage,
            productPrice: parseInt(productPrice),
            productType,
        });

        res.status(200).json({
            message: 'Product added successfully',
            result: { userId: req.user.userId, productName, productImage, productPrice: parseInt(productPrice), productType },
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

        console.log(userId)
        

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



exports.modifierProduit = async (req, res, next) => {
    try {
        const userId = req.user?.userId; // Ensure userId is extracted properly
        const { productId } = req.params; // Extract productId

        console.log("User ID:", userId);
        console.log("Product ID:", productId);

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing" });
        }

        // Extract updated fields
        const { productName, productImage, productPrice, productType } = req.body;

        // Check if product exists and belongs to the user
        const product = await Product.findOne({ where: { productId: parseInt(productId), userId } });

        if (!product) {
            return res.status(404).json({ message: "Product not found or you don't have permission to update it" });
        }

        if (!Object.values(ProductType).includes(productType)) {
            return res.status(400).json({ message: "Invalid product type" });
        }

        // Update product details
        await product.update({
            productName: productName || product.productName,
            productImage: productImage || product.productImage,
            productPrice: productPrice ? parseInt(productPrice) : product.productPrice,
            productType: productType || product.productType,
        });

        res.status(200).json({
            message: "Product updated successfully",
            result: product,
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




exports.supprimerProduit = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Authenticated user ID
        const { productId } = req.params; // Product ID from request params

        // Check if product exists and belongs to the user
        const product = await Product.findOne({ where: { productId: parseInt(productId), userId } });

        if (!product) {
            return res.status(404).json({ message: "Product not found or you don't have permission to delete it" });
        }

        // Delete product
        await product.destroy();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};


//Afficher Services Vente par user 
exports.afficherServicesVenteParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user


        if (req.user.typeActeur !== Acteur.Vendeur) {
            return res.status(400).json({ message: "the user must be Seller" });
        }
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
        const { rows: services, count: totalItems } = await ServiceVente.findAndCountAll({
            where: { vendeurId: userId },
            order: [['createdAt', 'DESC']],
            limit: size,
            offset: offset,
        });

        if (services.length === 0) {
            return res.status(200).json({
                message: "No services available",
                result: [],
                pagination: {
                    currentPage: page,
                    pageSize: size,
                    totalItems: totalItems,
                    totalPages: Math.ceil(totalItems / size),
                }
            });
        }

        res.status(200).json({
            message: "Services retrieved successfully",
            result: services,
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



//Confirmer ou refuser Service Vente