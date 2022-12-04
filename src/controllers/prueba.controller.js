const { connectionDB } = require('../../database/connection');
const ModelPrueba = require('../models/prueba.model');

const prueba = async (req, res) => {
  try {
    await connectionDB.sequelize.sync({ force: false });
    console.log('Table created exitosamente');
    res.json('Endpoint de prueba');
  } catch (error) {
    console.log(error);
    res.json({ msg: 'Error to create table pruebas' });
  }
};

module.exports = { prueba };
