const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords
const Product = require('../models/product');
const { Acteur, ProductType, ServiceStatus } = require('../constants/Enums');
const ServiceConsultation = require('../models/serviceConsultation');



//Afficher Services Vente par user 
exports.afficherServiceConsultationParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user


        if (req.user.typeActeur !== Acteur.Docteur) {
            return res.status(400).json({ message: "the user must be Doctor" });
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
        const { rows: services, count: totalItems } = await ServiceConsultation.findAndCountAll({
            where: { docteurId: userId },
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
exports.modifierStatusServiceConsultationParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { serviceId } = req.query;
        const { status } = req.body;

        if (!Object.values(ServiceStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid service status" });
        }

        const serviceConsultation = await ServiceConsultation.findOne({ where: { serviceId: serviceId, docteurId: userId } });

        if (!serviceConsultation) {
            return res.status(404).json({ message: "Service not found or you don't have permission to modify it" });
        }

        await serviceConsultation.update({ status });

        res.status(200).json({
            message: "Service status updated successfully",
            result: serviceConsultation,
        });
    } catch (error) {
        next(error);
    }
};


