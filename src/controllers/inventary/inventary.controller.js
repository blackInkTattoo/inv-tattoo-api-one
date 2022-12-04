const {
  saveProduct,
  getProducts,
  deleteProductFromDBByID,
  editProductFromDBByID,
  getProductFromDBByName,
} = require('../../services/inventary/inventary.services');
const reportServices = require('../../services/reports/reports.services');

const createProduct = async (req, res) => {
  const { body } = req;

  const prodSaved = await saveProduct(body);

  if (prodSaved) return res.json(prodSaved);

  res.json({ msg: 'Imposible crear nuevo producto', success: false, data: [] });
};

const getAllProducts = async (req, res) => {
  // const { body } = req;
  const products = await getProducts();

  if (products) return res.json(products);

  res.json({
    msg: 'Imposible obtener los productos',
    success: false,
    data: [],
  });
};

const getProductByName = async (req, res) => {
  const { query } = req.query;
  const products = await getProductFromDBByName(query);

  if (products) return res.json(products);

  res.json({
    msg: 'Imposible obtener los productos',
    success: false,
    data: [],
  });
};

const deleteProductByID = async (req, res) => {
  const { id } = req.query;
  const deletedProduct = await deleteProductFromDBByID(id);

  if (deletedProduct) return res.json(deletedProduct);

  res.json({
    msg: 'Imposible eliminar los producto',
    success: false,
    data: [],
  });
};

const editProductById = async (req, res) => {
  const { body } = req;
  const id = body.id;
  delete body.id;

  const editedProduct = await editProductFromDBByID(id, body);

  if (editedProduct) return res.json(editedProduct);

  res.json({
    msg: 'Imposible editar el producto',
    success: false,
    data: editedProduct,
  });
};

// reports
const getInventaryCurrenly = async (req, res) => {
  const inventaryData = await reportServices.getInventaryGeneral();
  res.json(inventaryData);
};

const getInventaryByDate = async (req, res) => {
  const { date, end_date } = req.query;
  const inventaryData = await reportServices.getInventaryByDate(date, end_date);
  res.json(inventaryData);
};

const controller = {
  createProduct,
  getAllProducts,
  getProductByName,
  deleteProductByID,
  editProductById,
  getInventaryCurrenly,
  getInventaryByDate,
};

module.exports = controller;
