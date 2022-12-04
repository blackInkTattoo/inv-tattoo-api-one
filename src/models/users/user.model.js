const { connectionDB } = require('../../../database/connection');
const { DataTypes } = require('sequelize');

const User = connectionDB.sequelize.define(
  'User',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user name',
      unique: true,
    },
    // name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // last_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
    },
    //   identificacion: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //   },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
