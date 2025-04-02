const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const { ServiceVenteType, ServiceStatus, ServiceLivraisonPar } = require('../constants/Enums');


const ServiceVente = sequelize.define('ServiceVente', {
    serviceId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },

    // Foreign key referencing User
    vendeurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId',
        },
        onDelete: 'CASCADE',
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId',
        },
        onDelete: 'CASCADE',
    },
    produits: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Items must be an array');
                }
                value.forEach(item => {
                    if (typeof item.productId !== 'number' || typeof item.nom !== 'string' || typeof item.prix !== 'number' || typeof item.productImage !== 'string') {
                        throw new Error('Chaque produit doit avoir un productId (number), un nom (string), un prix (number) et un productImage (string) ');
                    }
                });
            },
        },
    },


    type: {
        type: DataTypes.ENUM(...Object.values(ServiceVenteType)),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(ServiceStatus)),
        allowNull: false,
        defaultValue: ServiceStatus.EnCours
    },
    ServiceLivraisonPar: {
        type: DataTypes.ENUM(...Object.values(ServiceLivraisonPar)),
        allowNull: false,
        defaultValue: ServiceLivraisonPar.VetoMoov
    },


});

User.hasMany(ServiceVente, { foreignKey: 'vendeurId' });
ServiceVente.belongsTo(User, { foreignKey: 'vendeurId', as: 'vendeur' });

User.hasMany(ServiceVente, { foreignKey: 'clientId' });
ServiceVente.belongsTo(User, { foreignKey: 'clientId', as: 'client' });


module.exports = ServiceVente;
