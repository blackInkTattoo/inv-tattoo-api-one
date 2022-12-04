const {
  associateCustomerToOrder,
  associateProductToOrder,
  associateServicesToOrder,
  associateEmployeesToOrder,
  getCurrentOrders,
  annulateOrder,
  getDataToRePrintOrder,
  returnUtensilsToStock,
} = require('../../services/orders/searchProductsServicesAndEmployees.services');
const servicesPromotions = require('../../services/promotions/promotions.services');

const createOrder = async (req, res) => {
  const { body } = req;
  const {
    selectedClient,
    selectedProducts,
    selectedServices,
    selectedEmployees,
    total_to_pay,
    // type_payment,
    stateDefaultAmountToPay,
    vuelto,
    promotion,
    updateAt,
  } = body;

  // ordenes y clientes
  const partnersCustomer = await associateCustomerToOrder(
    selectedClient,
    total_to_pay,
    // type_payment,
    stateDefaultAmountToPay,
    vuelto,
    promotion,
    updateAt
  );

  if (!partnersCustomer.success) return res.json(partnersCustomer);

  // productos
  const partnersProducts = await associateProductToOrder(
    selectedProducts,
    partnersCustomer.data.num_control,
    updateAt
  );

  if (!partnersProducts.success) return res.json(partnersProducts);

  // servicios
  const partnersServices = await associateServicesToOrder(
    selectedServices,
    partnersCustomer.data.num_control,
    updateAt
  );

  if (!partnersServices.success) return res.json(partnersServices);

  // empleados
  const partnersEmployees = await associateEmployeesToOrder(
    selectedEmployees,
    partnersCustomer.data.num_control,
    updateAt
  );

  if (!partnersEmployees.success) return res.json(partnersEmployees);

  if (!isNaN(promotion)) {
    const promotionSelected = await servicesPromotions.getPromotionById(
      promotion
    );

    body.promotionDetails = promotionSelected.success
      ? promotionSelected.data
      : false;
  }

  body.num_control = partnersCustomer.data.num_control;
  body.vuelto = partnersCustomer.data.vuelto;
  body.ruc = process.env.RUCEMPRESA;

  res.json({
    msg: 'Orden generada exitosamente',
    success: true,
    data: body,
  });
};

const getCurrentOrdersByDB = async (req, res) => {
  const { date } = req.query;
  const ordersList = await getCurrentOrders(date);
  res.json(ordersList);
};

const AnularOrders = async (req, res) => {
  const { id } = req.query;
  const orderAnnulated = await annulateOrder(id);
  await returnUtensilsToStock(id);
  res.json(orderAnnulated);
};

const rePrintOrder = async (req, res) => {
  const { id } = req.query;
  const dataOrder = await getDataToRePrintOrder(id);
  res.json(dataOrder);
};

const orderController = {
  createOrder,
  getCurrentOrdersByDB,
  AnularOrders,
  rePrintOrder,
};

module.exports = orderController;
