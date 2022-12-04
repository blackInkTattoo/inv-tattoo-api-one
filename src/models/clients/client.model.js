const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Client = connectionDB.sequelize.define(
  'Clients',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName_client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification_client: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    phone_client: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

module.exports = Client;
