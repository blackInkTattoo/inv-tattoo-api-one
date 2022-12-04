const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Services = connectionDB.sequelize.define(
  'Services',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cod_service: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    amount_service: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    description_service: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Services;
