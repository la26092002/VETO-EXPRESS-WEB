const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');


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
                    if (typeof item.nom !== 'string' || typeof item.prix !== 'number') {
                        throw new Error('Chaque produit doit avoir un nom (string) et un prix (number) valides');
                    }
                });
            },
        },
    },

    // Invoice type (buy or sale)
    type: {
         type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: false,
    },
});

// Define association
User.hasMany(ServiceVente, { foreignKey: 'userId' });
ServiceVente.belongsTo(User, { foreignKey: 'userId' });

module.exports = ServiceVente;
