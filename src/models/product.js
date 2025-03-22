const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');
const { ProductType } = require('../constants/Enums');

const Product = sequelize.define('Product', {
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
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0, // Avoid NULL values
    validate: {
      min: 0, // Ensure price is not negative
    },
  },
  productType: {
    type: DataTypes.ENUM(...Object.values(ProductType)),
    allowNull: false,
  },
});

// Define association
User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });


module.exports = Product;