const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const OrdersServices = connectionDB.sequelize.define(
  'OrdersServices',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_service: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_control: {
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = OrdersServices;
