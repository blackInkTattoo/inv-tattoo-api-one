const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Buys = connectionDB.sequelize.define(
  'Buys',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    num_control_buy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_utils: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description_buy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_prod_buy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Buys;
