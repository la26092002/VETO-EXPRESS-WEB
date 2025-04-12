const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user'); // Adjust path if needed

const Pet = sequelize.define('Pet', {
  petId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  petName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  petType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  petAge: {
    type: DataTypes.STRING(50),  // String to allow flexible formats like "2 years"
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  }
});

// Setup the association
User.hasMany(Pet, { foreignKey: 'userId', onDelete: 'CASCADE' });
Pet.belongsTo(User, { foreignKey: 'userId' });

module.exports = Pet;
