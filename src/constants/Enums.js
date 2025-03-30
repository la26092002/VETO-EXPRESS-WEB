const Acteur = Object.freeze({
    Docteur: "Docteur",
    Vendeur: "Vendeur",
    Client: "Client",
    Admin: "Admin",
    Livreur: "Livreur"
});

const ServiceType = Object.freeze({
    DemandeRdv: "Demande de rendez-vous",
    ConsultationSuivi: "Consultation de suivi",
    RdvRapide: "Rendez-vous rapide"
});

const ServiceVenteType = Object.freeze({
    ProduitVeterinaire: "Produit vétérinaire",
    ProduitAnimalerie: "Produit animalerie"
});

const ProductType = Object.freeze({
    Veterinaire: "Produit vétérinaire",
    Animalerie: "Produit animalerie"
});

const ServiceStatus = Object.freeze({
    Confirmé: "Confirmé",
    EnCours: "En cours",
    Terminé: "Terminé",
    Annulé: "Annulé",
    Echoué: "Échoué"
});

const ServiceLivraisonPar = Object.freeze({
    VetoLib: "VetoLib", // Prise de rendez-vous en ligne avec un professionnel de la santé
    VetoMoov: "VetoMoov", // Livraison sécurisée des produits vétérinaires
    Urgence: "Urgence" // À revoir plus tard
});
module.exports = { Acteur, ServiceType, ProductType, ServiceVenteType, ServiceStatus, ServiceLivraisonPar };