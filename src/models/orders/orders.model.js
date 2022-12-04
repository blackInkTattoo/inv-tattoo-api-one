const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Orders = connectionDB.sequelize.define(
  'Orders',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_control: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // type_payment: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    cash: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    card: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    plin: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    yape: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    vuelto: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    id_promotion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    state_null: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

module.exports = Orders;
