const {
  searchProductsServicesAndEmployeesFromDB,
} = require('../../services/orders/searchProductsServicesAndEmployees.services');
const {
  getProductFromDBByID,
} = require('../../services/inventary/inventary.services');

const searchProductsServicesAndEmployeesByDescriptions = async (req, res) => {
  const { query, flag } = req.query;
  const resultSearch = await searchProductsServicesAndEmployeesFromDB(
    query,
    flag
  );
  res.json(resultSearch);
};

const getProductByID = async (req, res) => {
  const product = await getProductFromDBByID(req.query.id);
  res.json(product);
};

module.exports = {
  searchProductsServicesAndEmployeesByDescriptions,
  getProductByID,
};
