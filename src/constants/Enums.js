const Acteur = Object.freeze({
    Docteur: "Docteur",
    Vendeur: "Vendeur",
    Client: "Client",
    Admin: "Admin",
    Livreur: "Livreur"
});

const ServiceType = Object.freeze({
    Service1: "Service1",
    Service2: "Service2",
    Service3: "Service3",
    Service4: "Service4",
    Service5: "Service5"
});

const ServiceVenteType = Object.freeze({
    Service1: "Service1",
    Service2: "Service2",
    Service3: "Service3",
    Service4: "Service4",
    Service5: "Service5"
});

const ProductType = Object.freeze({
    ProductType1: "ProductType1",
    ProductType2: "ProductType2",
    ProductType3: "ProductType3",
    ProductType4: "ProductType4",
    ProductType5: "ProductType5"
});

const ServiceStatus = Object.freeze({
    Confirmé: "Confirmé",
    EnCours: "En cours",
    Terminé: "Terminé",
    Annulé: "Annulé",
    Echoué: "Échoué"
});

const ServiceLivraisonPar = Object.freeze({
    Livreur: "Livreur",   // Livraison effectuée par un livreur
    Client: "Client",     // Livraison effectuée par le client (auto-récupération)
});
module.exports = { Acteur, ServiceType, ProductType, ServiceVenteType,ServiceStatus,ServiceLivraisonPar };
