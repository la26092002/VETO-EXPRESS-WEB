const jwt = require('jsonwebtoken'); // Ensure you import jwt
const bcrypt = require('bcrypt'); // Ensure bcrypt is used to hash/compare passwords
const Product = require('../models/product');
const { Acteur, ProductType, ServiceStatus } = require('../constants/Enums');
const ServiceConsultation = require('../models/serviceConsultation');


const { Op } = require('sequelize');

exports.afficherServiceConsultationParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (req.user.typeActeur !== Acteur.Docteur) {
            return res.status(400).json({ message: "The user must be a Doctor" });
        }

        let { page, size, serviceId, ServiceLivraisonPar } = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 10;

        if (page < 1 || size < 1) {
            return res.status(400).json({ message: "Page and size must be positive numbers" });
        }

        const offset = (page - 1) * size;

        // Build dynamic where clause
        const whereClause = {
            docteurId: userId,
        };

        if (serviceId) {
            whereClause.serviceId = { [Op.like]: `%${serviceId}%` }; // Partial match
        }

        if (ServiceLivraisonPar) {
            whereClause.ServiceLivraisonPar = ServiceLivraisonPar;
        }

        const { rows: services, count: totalItems } = await ServiceConsultation.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: size,
            offset: offset,
            attributes: [
                'serviceId',
                'ServiceLivraisonPar',
                'dateRdv',
                'status',
                'type',
                'pet',
                'clientId',
                'docteurId',
                'createdAt'
            ]
        });

        return res.status(200).json({
            message: services.length === 0 ? "No services available" : "Services retrieved successfully",
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



// Confirmer ou refuser Service Vente (update service vente)
exports.modifierServiceConsultationParUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { serviceId } = req.query;
        const { status, dateRdv } = req.body;

        // Validate status if provided
        if (status && !Object.values(ServiceStatus).includes(status)) {
            return res.status(400).json({ message: "Invalid service status" });
        }

        const serviceConsultation = await ServiceConsultation.findOne({ where: { serviceId: serviceId, docteurId: userId } });

        if (!serviceConsultation) {
            return res.status(404).json({ message: "Service not found or you don't have permission to modify it" });
        }

        // Prepare update fields
        const updateData = {};
        if (status) updateData.status = status;
        if (dateRdv) updateData.dateRdv = dateRdv;

        await serviceConsultation.update(updateData);

        res.status(200).json({
            message: "Service updated successfully",
            result: serviceConsultation,
        });
    } catch (error) {
        next(error);
    }
};



