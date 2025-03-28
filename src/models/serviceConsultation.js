const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const { ServiceType } = require('../constants/Enums');


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


    // Invoice type (buy or sale)
    type: {
         type: DataTypes.ENUM(...Object.values(ServiceType)),
        allowNull: false,
    },
});

// Define association
User.hasMany(ServiceConsultation, { foreignKey: 'userId' });
ServiceConsultation.belongsTo(User, { foreignKey: 'userId' });

module.exports = ServiceConsultation;
