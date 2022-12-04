const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const Expenditures = connectionDB.sequelize.define(
  'Expenditures',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    num_control_expenditures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_expenditures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount_prod_expenditures: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    state_null: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

module.exports = Expenditures;
