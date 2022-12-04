const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Employee = connectionDB.sequelize.define(
  'Employee',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    phone_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fixed_payment: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    percent_payment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Employee;
