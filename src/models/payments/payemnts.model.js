const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Payments = connectionDB.sequelize.define(
  'Payments',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    num_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_payment: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_payment: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // defaultValue: new Date(Date.now()),
    },
    last_date_payment: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      // defaultValue: new Date(Date.now()),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Payments;
