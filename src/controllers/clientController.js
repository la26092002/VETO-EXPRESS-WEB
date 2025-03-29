const { ServiceVenteType, ServiceType, Acteur } = require('../constants/Enums');
const ServiceVente = require('../models/ServiceVente');
const ServiceConsultation = require('../models/serviceConsultation');

const { v4: uuidv4 } = require('uuid'); // For generating unique serviceId
const User = require('../models/user');


exports.creerServiceVente = async (req, res) => {
    try {
        const clientId = req.user?.userId; // Get client ID from authenticated user
        const { vendeurId, produits, type } = req.body;

        console.log("Client ID:", clientId);
        console.log("Seller ID:", vendeurId);
        console.log("Products:", produits);
        console.log("Type:", type);

        // Validate inputs
        if (!vendeurId || !Array.isArray(produits) || produits.length === 0 || !type) {
            return res.status(400).json({ message: "All fields (vendeurId, produits, type) are required" });
        }

        if (!Object.values(ServiceVenteType).includes(type)) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // Generate unique serviceId
        const serviceId = uuidv4();

        // Create the service
        const newService = await ServiceVente.create({
            serviceId,
            vendeurId,
            clientId,
            produits,
            type,
        });

        res.status(201).json({
            message: "Service created successfully",
            service: newService,
        });
    } catch (error) {
        console.error("Error while creating the service:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



exports.creerServiceConsultation = async (req, res) => {
    try {
        const clientId = req.user?.userId; // Get client ID from authenticated user
        const { docteurId, type } = req.body;

        console.log("Client ID:", clientId);
        console.log("Doctor ID:", docteurId);
        console.log("Type:", type);

        // Validate inputs
        if (!docteurId || !type) {
            return res.status(400).json({ message: "All fields (docteurId, type) are required" });
        }

        if (!Object.values(ServiceType).includes(type)) {
            return res.status(400).json({ message: "Invalid service type" });
        }

        // Generate unique serviceId
        const serviceId = uuidv4();


        const docteur = await User.findOne({ where: { userId:docteurId } });
        if (!docteur.typeActeur === Acteur.Docteur) {
            return res.status(404).json({ message: "docteurId not found as doctor" });
        }
        // Create the consultation service
        const newService = await ServiceConsultation.create({
            serviceId,
            docteurId,
            clientId,
            type,
        });

        res.status(201).json({
            message: "Consultation service created successfully",
            service: newService,
        });
    } catch (error) {
        console.error("Error while creating the consultation service:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


//afficher des veudeur a cote de client(en utilisant API de Google)
exports.getVendeurs = async (req, res) => {
    try {
        const vendeurs = await User.findAll({
            where: { typeActeur: Acteur.Vendeur },attributes: { exclude: ['password'] }
            
        });

        res.status(200).json({ vendeurs });
    } catch (error) {
        console.error("Erreur lors de la récupération des vendeurs:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

//afficher des docteur a cote de client((en utilisant API de Google)
exports.getDocteurs = async (req, res) => {
    try {
        const docteurs = await User.findAll({
            where: { typeActeur: Acteur.Docteur },attributes: { exclude: ['password'] }
        });

        res.status(200).json({ docteurs });
    } catch (error) {
        console.error("Erreur lors de la récupération des docteurs:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};
