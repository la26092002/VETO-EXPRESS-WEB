const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  businessActivity: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  tradeRegisterNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nif: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nis: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ai: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bankAccountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  companyCapital: {
    type: DataTypes.STRING(250),
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  logoImage: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = User;
