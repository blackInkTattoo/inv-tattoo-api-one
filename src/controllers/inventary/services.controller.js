const {
  saveService,
  getAllServicesFromDB,
  deleteServicefromDB,
  editServiceFromDB,
  getServicesFromDBByName,
} = require('../../services/inventary/services.services');

const createService = async (req, res) => {
  const { body } = req;

  const newData = {
    cod_service: body.cod_product,
    amount_service: body.amount_product,
    description_service: body.description_product,
  };

  const serviceSaved = await saveService(newData);
  res.json(serviceSaved);
};

const getAllServices = async (req, res) => {
  const servicesList = await getAllServicesFromDB();
  res.json(servicesList);
};

const getServicesByName = async (req, res) => {
  const { query } = req.query;
  const servicesList = await getServicesFromDBByName(query);
  res.json(servicesList);
};

const deleteService = async (req, res) => {
  const { id } = req.query;
  const deletedService = await deleteServicefromDB(id);
  res.json(deletedService);
};

const editService = async (req, res) => {
  const { id } = req.query;
  const { body } = req;
  const Data = {
    cod_service: body.cod_product,
    amount_service: body.amount_product,
    description_service: body.description_product,
  };

  const editedService = await editServiceFromDB(id, Data);
  res.json(editedService);
};

module.exports = {
  createService,
  getAllServices,
  getServicesByName,
  deleteService,
  editService,
};
