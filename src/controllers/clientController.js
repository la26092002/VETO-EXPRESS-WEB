const { ServiceVenteType } = require('../constants/Enums');
const ServiceVente = require('../models/ServiceVente');
const { v4: uuidv4 } = require('uuid'); // For generating unique serviceId


exports.creerService = async (req, res) => {
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
