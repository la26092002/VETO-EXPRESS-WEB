const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');


const Invoice = sequelize.define('Invoice', {
    invoiceId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    //tva
    vat: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    //mode_reglement
    paymentMethod: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },

    // Products array with product ID and VAT
    products: {
        type: DataTypes.JSON, // [{ productId: 1, vat: 19 }]
        allowNull: false,
    },

    // Foreign key referencing User
    userId: {
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
        type: DataTypes.ENUM('buy', 'sale'),
        allowNull: false,
    },
});

// Define association
User.hasMany(Invoice, { foreignKey: 'userId' });
Invoice.belongsTo(User, { foreignKey: 'userId' });

module.exports = Invoice;
