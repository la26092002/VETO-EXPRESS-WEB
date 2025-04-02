const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const { Acteur } = require('../constants/Enums');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  nomEtablissement: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  adresseMap: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {  // Add password field
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: /^[0-9+\-() ]+$/i, // Allow numbers, +, -, ()
    },
  },
  businessActivity: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  Kbis: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  isValidate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  typeActeur: {
    type: DataTypes.ENUM(...Object.values(Acteur)),
    allowNull: false,
  },
  ban: {  // New field to ban users
    type: DataTypes.BOOLEAN,
    defaultValue: false, // By default, users are not banned
  },
  
  userLatitude: {  // New field for user latitude
    type: DataTypes.FLOAT,
    defaultValue: null, // Default value is null
  },
  userLongitude: {  // New field for user longitude
    type: DataTypes.FLOAT,
    defaultValue: null, // Default value is null
  }


});

module.exports = User;