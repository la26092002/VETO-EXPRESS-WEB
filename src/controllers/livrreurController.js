const ServiceConsultation = require('../models/serviceConsultation');  // Import the model
const { ServiceType, ServiceStatus } = require('../constants/Enums');  // Import enums
const User = require('../models/user');
const ServiceVente = require('../models/serviceVente');

exports.AfficherServiceConsultations = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 10, serviceId, ServiceLivraisonPar } = req.query;  // Extract query params
        
        const whereClause = {};

        // If 'type' is provided in query, filter by it
        if (type && Object.values(ServiceType).includes(type)) {
            whereClause.type = type;
        }

        // If 'status' is provided in query, filter by it
        if (status && Object.values(ServiceStatus).includes(status)) {
            whereClause.status = status;
        }

        // If 'serviceId' is provided in query, filter by it
        if (serviceId) {
            whereClause.serviceId = serviceId;  // Assuming serviceId is directly available in the model
        }

        // If 'ServiceLivraisonPar' is provided in query, filter by it
        if (ServiceLivraisonPar) {
            whereClause.ServiceLivraisonPar = ServiceLivraisonPar;  // Assuming ServiceLivraisonPar is a valid field in the model
        }

        // Fetch the consultations with pagination and filtering
        const serviceConsultations = await ServiceConsultation.findAndCountAll({
            where: whereClause,  // Apply filters
            include: [
                { model: User, as: 'docteur', attributes: ['nom', 'email', 'telephone'] },  // Include 'docteur' info
                { model: User, as: 'client', attributes: ['nom', 'email', 'telephone'] },  // Include 'client' info
            ],
            limit: parseInt(limit),  // Limit results
            offset: (parseInt(page) - 1) * parseInt(limit),  // Pagination offset
            order: [['dateRdv', 'ASC']],  // Order by date of appointment (ascending)
        });

        res.status(200).json({
            total: serviceConsultations.count,
            totalPages: Math.ceil(serviceConsultations.count / limit),
            currentPage: parseInt(page),
            consultations: serviceConsultations.rows,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des consultations:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
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

        const serviceVente = await ServiceConsultation.findOne({ where: { serviceId: serviceId } });

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







exports.AfficherServiceVente = async (req, res) => {
    try {
        const { type, status, page = 1, limit = 10, serviceId, ServiceLivraisonPar } = req.query;  // Extract query params
        
        const whereClause = {};

        // If 'type' is provided in query, filter by it
        if (type && Object.values(ServiceType).includes(type)) {
            whereClause.type = type;
        }

        // If 'status' is provided in query, filter by it
        if (status && Object.values(ServiceStatus).includes(status)) {
            whereClause.status = status;
        }

        // If 'serviceId' is provided in query, filter by it
        if (serviceId) {
            whereClause.serviceId = serviceId;  // Assuming serviceId is directly available in the model
        }

        // If 'ServiceLivraisonPar' is provided in query, filter by it
        if (ServiceLivraisonPar) {
            whereClause.ServiceLivraisonPar = ServiceLivraisonPar;  // Assuming ServiceLivraisonPar is a valid field in the model
        }

        // Fetch the consultations with pagination and filtering
        const serviceConsultations = await ServiceVente.findAndCountAll({
            where: whereClause,  // Apply filters
            include: [
                { model: User, as: 'vendeur', attributes: ['nom', 'email', 'telephone'] },  // Include 'docteur' info
                { model: User, as: 'client', attributes: ['nom', 'email', 'telephone'] },  // Include 'client' info
            ],
            limit: parseInt(limit),  // Limit results
            offset: (parseInt(page) - 1) * parseInt(limit),  // Pagination offset
           // order: [['dateRdv', 'ASC']],  // Order by date of appointment (ascending)
        });

        res.status(200).json({
            total: serviceConsultations.count,
            totalPages: Math.ceil(serviceConsultations.count / limit),
            currentPage: parseInt(page),
            consultations: serviceConsultations.rows,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des consultations:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
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

        const serviceVente = await ServiceVente.findOne({ where: { serviceId: serviceId } });

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



