const { ServiceVenteType, ServiceType, Acteur,ServiceLivraisonPar:LivraisonParFromEnum, ServiceStatus } = require('../constants/Enums');

const ServiceConsultation = require('../models/serviceConsultation');

const { v4: uuidv4 } = require('uuid'); // For generating unique serviceId
const User = require('../models/user');
const ServiceVente = require('../models/serviceVente');
const Pet = require('../models/pet');


exports.creerServiceVente = async (req, res) => {
    try {
        const clientId = req.user?.userId; // Get client ID from authenticated user
        const { vendeurId, produits, type,ServiceLivraisonPar } = req.body;



        // Validate inputs
        if (!vendeurId || !Array.isArray(produits) || produits.length === 0 || !type || !ServiceLivraisonPar) {
            return res.status(400).json({ message: "All fields (vendeurId, produits, type, ServiceLivraisonPar ) are required" });
        }

        if (!Object.values(LivraisonParFromEnum).includes(ServiceLivraisonPar)) {
            return res.status(400).json({ message: "Invalid service ServiceLivraisonPar" });
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
            ServiceLivraisonPar
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



exports.afficherServiceVenteClient = async (req, res) => {
    try {
        const clientId = req.user?.userId;
        const { type, status, page = 1, limit = 10 } = req.query;

        const filters = { clientId };

        // Optional filters
        if (type) {
            if (!Object.values(ServiceVenteType).includes(type)) {
                return res.status(400).json({ message: "Invalid service type" });
            }
            filters.type = type;
        }

        if (status) {
            if (!Object.values(ServiceStatus).includes(status)) {
                return res.status(400).json({ message: "Invalid service status" });
            }
            filters.status = status;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Fetch total count
        const total = await ServiceVente.count({ where: filters });

        // Fetch paginated services
        const services = await ServiceVente.findAll({
            where: filters,
            include: [
                {
                    model: User,
                    as: 'vendeur',
                    attributes: ['userId', 'nom', 'telephone', 'email'],
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
        });

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            services,
        });
    } catch (error) {
        console.error("Error fetching vente services:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




exports.creerServiceConsultation = async (req, res) => {
    try {
        const clientId = req.user?.userId; // Get client ID from authenticated user
        const { docteurId, type,ServiceLivraisonPar } = req.body;

        console.log("Client ID:", clientId);
        console.log("Doctor ID:", docteurId);
        console.log("Type:", type);

        // Validate inputs
        if (!docteurId || !type || !ServiceLivraisonPar) {
            return res.status(400).json({ message: "All fields (docteurId, type, ServiceLivraisonPar) are required" });
        }
        

        if (!Object.values(LivraisonParFromEnum).includes(ServiceLivraisonPar)) {
            return res.status(400).json({ message: "Invalid service ServiceLivraisonPar" });
        }
        if (!Object.values(ServiceType).includes(type)) {
            return res.status(400).json({ message: "Invalid service type" });
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


exports.afficherServiceConsultationClient = async (req, res) => {
    try {
        const clientId = req.user?.userId;
        const { type, status, page = 1, limit = 10 } = req.query;

        const filters = { clientId };

        // Optional filters
        if (type) {
            if (!Object.values(ServiceType).includes(type)) {
                return res.status(400).json({ message: "Invalid service type" });
            }
            filters.type = type;
        }

        if (status) {
            if (!Object.values(ServiceStatus).includes(status)) {
                return res.status(400).json({ message: "Invalid service status" });
            }
            filters.status = status;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Fetch total count for pagination
        const total = await ServiceConsultation.count({ where: filters });

        // Fetch paginated results
        const consultations = await ServiceConsultation.findAll({
            where: filters,
            include: [
                {
                    model: User,
                    as: 'docteur',
                    attributes: ['userId', 'nom', 'telephone', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: offset,
        });

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            consultations,
        });
    } catch (error) {
        console.error("Error fetching consultations:", error);
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





//***************************  - Pet -  *************************************** */



exports.addPet = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { petName, petType, petAge } = req.body;
  
      if (!petName || !petType || !petAge) {
        return res.status(400).json({ message: "petName, petType, and petAge are required" });
      }
  
      const newPet = await Pet.create({
        userId,
        petName,
        petType,
        petAge,
      });
  
      res.status(201).json({
        message: "Pet added successfully",
        pet: newPet,
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  
  

  exports.deletePet = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { petId } = req.params;
  
      const pet = await Pet.findOne({ where: { petId, userId } });
  
      if (!pet) {
        return res.status(404).json({ message: "Pet not found or doesn't belong to the user" });
      }
  
      await pet.destroy();
  
      res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };


  exports.getPets = async (req, res) => {
    try {
      const userId = req.user?.userId;
  
      const pets = await Pet.findAll({ where: { userId } });
  
      res.status(200).json({
        message: "Pets fetched successfully",
        pets,
      });
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  
  

