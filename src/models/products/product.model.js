const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Product = connectionDB.sequelize.define(
  'Product',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cod_product: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    amount_product: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    description_product: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Product;
