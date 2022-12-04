const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const OrdersProducts = connectionDB.sequelize.define(
  'OrdersProducts',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_product: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    num_control: {
      // allowNull: false,
      type: DataTypes.STRING,
    },
    amount_to_use: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // defaultValue: new Date(Date.now()),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = OrdersProducts;
