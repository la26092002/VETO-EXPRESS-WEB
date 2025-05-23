const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords
const Product = require('../models/product');
const { Acteur, ProductType, ServiceStatus } = require('../constants/Enums');
const ServiceVente = require('../models/serviceVente');
const { Op } = require('sequelize');



exports.ajouterProduit = async (req, res, next) => {
    try {
        const { productName, productPrice, productType } = req.body;

        if (req.user.typeActeur !== Acteur.Vendeur) {
            return res.status(401).json({ message: 'Just seller have access to add product' });
        }

        if (!Object.values(ProductType).includes(productType)) {
            return res.status(400).json({ message: "Invalid ProductType" });
        }

        if (!productName || !req.file || !productPrice || !productType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const imageName = req.file.filename;

        const createdProduct = await Product.create({
            userId: parseInt(req.user.userId),
            productName,
            productImage: imageName,
            productPrice: parseInt(productPrice),
            productType,
        });

        res.status(200).json({
            message: 'Product added successfully',
            result: {
                userId: req.user.userId,
                productName,
                productImage: imageName,
                productPrice: parseInt(productPrice),
                productType
            }
        });
    } catch (error) {
        next(error);
    }
};



exports.afficherProduitParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user

        // Extract pagination and filter parameters
        let { page, size, productType  } = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;

        if (page < 1 || size < 1) {
            return res.status(400).json({ message: "Page and size must be positive numbers" });
        }

        const offset = (page - 1) * size;

        // Build the where clause
        const whereClause = { userId };
        if (productType) {
            whereClause.productType = productType;
        }

        // Fetch products with pagination and filtering
        const { rows: products, count: totalItems } = await Product.findAndCountAll({
            where: whereClause,
            limit: size,
            offset: offset,
        });

        res.status(200).json({
            message: "Products retrieved successfully",
            result: products.map(product => ({
                ...product.dataValues,
                productImage: `ProductImages/${product.productImage}`
            })),
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
        const whereClause = {};

        // Extract pagination parameters from query (default: page=1, size=10)
        let { page, size , serviceId, ServiceLivraisonPar} = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;

        if (page < 1 || size < 1) {
            return res.status(400).json({ message: "Page and size must be positive numbers" });
        }

        // Calculate offset
        const offset = (page - 1) * size;

          // If 'serviceId' is provided in query, filter by it
          if (serviceId) {
            whereClause.serviceId = {
                [Op.like]: `%${serviceId}%`
            };
        }
        

        // If 'ServiceLivraisonPar' is provided in query, filter by it
        if (ServiceLivraisonPar) {
            whereClause.ServiceLivraisonPar = ServiceLivraisonPar;  // Assuming ServiceLivraisonPar is a valid field in the model
        }
        whereClause.vendeurId = userId; 

       


        // Fetch products with pagination
        const { rows: services, count: totalItems } = await ServiceVente.findAndCountAll({
            where:  whereClause  ,
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



//Confirmer ou refuser Service Vente  (update service vente)
exports.modifierStatusServicesVenteParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { serviceId } = req.query;
        const { status } = req.body;

        if (!Object.values(ServiceStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid service status" });
        }

        const serviceVente = await ServiceVente.findOne({ where: { serviceId: serviceId, vendeurId: userId } });

        if (!serviceVente) {
            return res.status(404).json({ message: "Service not found or you don't have permission to modify it" });
        }

        await serviceVente.update({ status });

        res.status(200).json({
            message: "Service status updated successfully",
            result: serviceVente,
        });
    } catch (error) {
        next(error);
    }
};
