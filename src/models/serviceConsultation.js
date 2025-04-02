const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const { ServiceType, ServiceStatus, ServiceLivraisonPar } = require('../constants/Enums');


const ServiceConsultation = sequelize.define('ServiceConsultation', {
    serviceId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },

    // Foreign key referencing User
    docteurId: {
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

    // Date de rendez-vous
    dateRdv: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(ServiceStatus)),
        allowNull: false,
        defaultValue: ServiceStatus.EnCours
    },

    // Invoice type (buy or sale)
    type: {
        type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: false,
    },

    ServiceLivraisonPar: {
        type: DataTypes.ENUM(...Object.values(ServiceLivraisonPar)),
        allowNull: false,
        defaultValue: ServiceLivraisonPar.VetoMoov
    },
});

// Define association
User.hasMany(ServiceConsultation, { foreignKey: 'docteurId' });
ServiceConsultation.belongsTo(User, { foreignKey: 'docteurId', as: 'docteur' });

User.hasMany(ServiceConsultation, { foreignKey: 'clientId' });
ServiceConsultation.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
module.exports = ServiceConsultation;