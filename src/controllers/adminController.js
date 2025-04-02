const { ServiceVenteType, ServiceType, Acteur,ServiceLivraisonPar:LivraisonParFromEnum } = require('../constants/Enums');

const ServiceConsultation = require('../models/serviceConsultation');

const { v4: uuidv4 } = require('uuid'); // For generating unique serviceId
const User = require('../models/user');
const ServiceVente = require('../models/serviceVente');



//afficher des Users
exports.AfficherUsers = async (req, res) => {
    try {
        const { typeActeur, page = 1, limit = 10 } = req.query;

        const whereClause = typeActeur ? { typeActeur } : {};

        const users = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [['typeActeur', 'ASC']], // Tri par typeActeur
        });

        res.status(200).json({
            total: users.count,
            totalPages: Math.ceil(users.count / limit),
            currentPage: parseInt(page),
            users: users.rows,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

