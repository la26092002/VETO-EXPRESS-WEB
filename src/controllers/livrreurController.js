const ServiceConsultation = require('../models/serviceConsultation');  // Import the model
const { ServiceType, ServiceStatus } = require('../constants/Enums');  // Import enums
const User = require('../models/user');

exports.AfficherServiceConsultations = async (req, res) => {
    try {
        const { type,status, page = 1, limit = 10 } = req.query;  // Extract query params
        
        const whereClause = {};
        
        // If 'type' is provided in query, filter by it
        if (type && Object.values(ServiceType).includes(type)) {
            whereClause.type = type;
        }

        // If 'status' is provided in query, filter by it
        if (status && Object.values(ServiceStatus).includes(status)) {
            whereClause.status = status;
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
