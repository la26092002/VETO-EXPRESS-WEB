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
    allowNull: false,
  },
  isValidate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  typeActeur: {
    type: DataTypes.ENUM(...Object.values(Acteur)),
    allowNull: false,
  },


});

module.exports = User;