const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Product = sequelize.define('Product', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  productType: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
});


module.exports = Product;
