const { connectionDB } = require('../../database/connection');
const { DataTypes } = require('sequelize');

const Prueba = connectionDB.sequelize.define('Prueba', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Prueba;
