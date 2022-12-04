const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Promotions = connectionDB.sequelize.define(
  'Promotions',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    description_promotion: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    state_promotion: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Promotions;
