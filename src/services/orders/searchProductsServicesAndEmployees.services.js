const { Op } = require('sequelize');
const { connectionDB } = require('../../../database/connection');
const { QueryTypes } = require('sequelize');
const conversorNumbersToLetter = require('conversor-numero-a-letras-es-ar');
const ModelOrders = require('../../models/orders/orders.model');
const ModelProduct = require('../../models/products/product.model');
const ModelEmployee = require('../../models/employess/employess.model');
const ModelServices = require('../../models/services/services.model');
const ModelOrdersProducts = require('../../models/orders/ordersProducts.model');
const ModelOrdersServices = require('../../models/orders/orsersServices.model');
const ModelOrdersEmployees = require('../../models/orders/ordersEmployees.model');
const { getProductFromDBByName } = require('../inventary/inventary.services');
const {
  getServicesFromDBByName,
  getServicesByNumontrol,
} = require('../inventary/services.services');
// const { getEmployeeByName } = require('../employess/employees.services');
const handleOrders = require('../../utils/commonFunctions');
const { getClientByID } = require('../clients/clients.services');
const servicesPromotions = require('../promotions/promotions.services');

const searchProductsServicesAndEmployeesFromDB = async (query, flag) => {
  try {
    switch (flag) {
      case 'tools':
        return await getProductFromDBByName(query);

      case 'services':
        return await getServicesFromDBByName(query);

      case 'employees':
        return ({ data } = await getEmployeeByName(query));

      default:
        return { msg: 'No se ha encontrado nada', success: false, data: [] };
    }
  } catch (error) {
    console.log('error al buscar productos, servicios o empleados ->', error);
    return {
      msg: 'Error al buscar.',
      success: false,
      data: error,
    };
  }
};
// ordenes
const associateCustomerToOrder = async (
  client,
  total,
  // type_payment,
  stateDefaultAmountToPay,
  vuelto,
  promotion,
  updateAt
) => {
  try {
    const buildedClient = handleOrders.handleOrders.replaceIDWhereObj(
      [client],
      'id_client',
      'id'
    );

    const newNumControl =
      await handleOrders.handleOrders.generateNewNumberControl();
    const flutterClient = buildedClient[0];

    flutterClient.num_control = newNumControl;
    flutterClient.payment_total = total;
    flutterClient.payment_total_letter =
      handleOrders.handleOrders.converterNumsToLetters(total);
    flutterClient.updateAt = updateAt;
    const numFactura = await handleOrders.handleOrders.getCountOrders();
    flutterClient.numFactura = numFactura + 1;
    flutterClient.cash = stateDefaultAmountToPay.cash;
    flutterClient.card = stateDefaultAmountToPay.card;
    flutterClient.plin = stateDefaultAmountToPay.plin;
    flutterClient.yape = stateDefaultAmountToPay.yape;
    flutterClient.vuelto = vuelto;
    flutterClient.id_promotion = promotion;

    const newClientToOrder = new ModelOrders(flutterClient);
    const clientSaved = await newClientToOrder.save();

    return {
      msg: 'Cliente asociado exitosamente.',
      success: true,
      data: clientSaved,
    };
  } catch (error) {
    console.log('error al asociar cliente a la orden ->', error);
    return {
      msg: 'Error al asociar cliente a la orden.',
      success: false,
      data: error,
    };
  }
};

const getOrderByNumControl = async (control) =>
  await ModelOrders.findOne({
    where: {
      num_control: control,
    },
  });

const getCurrentOrders = async (date) => {
  try {
    const listCurrentOrders = await ModelOrders.findAll({
      where: {
        updateAt: date,
      },
    });

    return {
      msg: 'Lista de ordenes.',
      success: true,
      data: listCurrentOrders,
    };
  } catch (error) {
    console.log('error al buscar ordenes ->', error);
    return {
      msg: 'Error al buscar ordenes.',
      success: false,
      data: [],
    };
  }
};

const getOrdersByDateRange = async (date, end_date) => {
  try {
    const currenlyOrders = await ModelOrders.findAll({
      where: {
        updateAt: {
          [Op.between]: [date, end_date ? end_date : date],
        },
      },
    });

    return {
      msg: `Ordenes entre ${date} - ${end_date}`,
      success: true,
      data: currenlyOrders,
    };
  } catch (error) {
    console.log('Error al obtener ordenes por fechas ->', error);
    return {
      msg: 'Error al obtener ordenes por fechas.',
      success: false,
      data: error,
    };
  }
};

const getOrderById = async (id_order) => {
  try {
    const Order = await ModelOrders.findOne({
      where: {
        id: id_order,
      },
    });

    return {
      msg: `Orden`,
      success: true,
      data: Order,
    };
  } catch (error) {
    console.log('Error al obtener ordenes por fechas ->', error);
    return {
      msg: 'Error al obtener ordenes por fechas.',
      success: false,
      data: error,
    };
  }
};

const annulateOrder = async (id) => {
  try {
    const annulatedOrder = await ModelOrders.update(
      {
        state_null: true,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return {
      msg: 'Orden anulada exitosamente.',
      success: true,
      data: annulatedOrder,
    };
  } catch (error) {
    console.log('error al anular orden ->', error);
    return {
      msg: 'Error al anular orden.',
      success: false,
      data: [],
    };
  }
};

const returnUtensilsToStock = async (id_order) => {
  try {
    const dataOrder = await getOrderById(id_order);

    // * Productos asociados a la orden
    const dataOrdersProducts = await ModelOrdersProducts.findAll({
      where: {
        num_control: dataOrder.data.num_control,
      },
    });

    // * recorremos y sumamos cantidades usadas al producto segun id

    let stock = [];

    for (const product of dataOrdersProducts) {
      const updatedProduct = await connectionDB.sequelize.query(
        `UPDATE products set amount_product = amount_product + ${product.amount_to_use} WHERE id = ${product.id_product}`,
        {
          type: QueryTypes.UPDATE,
        }
      );

      stock.push(updatedProduct);
    }

    return {
      msg: 'Stock actualizado exitosamente.',
      success: true,
      data: updatedProduct[0],
    };
  } catch (error) {
    console.log('error al anular orden ->', error);
    return {
      msg: 'Error al anular orden.',
      success: false,
      data: [],
    };
  }
};

const getOrdersByIdEmployee = async (id_employee, start_date, end_date) => {
  try {
    const result = [];

    const numControlOrdersList = await ModelOrdersEmployees.findAll({
      where: {
        id_employee: id_employee,
        updateAt: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    for (const order of numControlOrdersList) {
      const orderData = await ModelOrders.findAll({
        where: {
          num_control: order.dataValues.num_control,
          state_null: JSON.parse(false),
        },
      });

      result.push(orderData[0]);
    }

    return {
      msg: 'ordenes asociadas al empleado',
      success: false,
      data: result,
    };
  } catch (error) {
    console.log('Error al buscar ordenes asociadas al empleado ->', error);
    return {
      msg: 'Error al buscar ordenes asociadas al empleado',
      success: false,
      data: [],
    };
  }
};

// products
const associateProductToOrder = async (products, num_control, date_created) => {
  let productsSaved = [];
  try {
    const buildedProducts = handleOrders.handleOrders.replaceIDWhereObj(
      products,
      'id_product',
      'id'
    );

    for (let element of buildedProducts) {
      element.num_control = num_control;
      await restAmountProductsInventary(element);
      element.updateAt = date_created;
      const newProductsPartners = new ModelOrdersProducts(element);
      const saved = await newProductsPartners.save();
      productsSaved.push(saved);
    }

    return {
      msg: 'Productos asociados exitosamente.',
      success: true,
      data: productsSaved,
    };
  } catch (error) {
    console.log('error al asociar productos a la orden ->', error);
    return {
      msg: 'Error al asociar productos a la orden.',
      success: false,
      data: error,
    };
  }
};

const restAmountProductsInventary = async (product) => {
  try {
    await ModelProduct.update(
      {
        amount_product: product.amount_product - product.amount_to_use,
      },
      {
        where: {
          id: product.id_product,
        },
      }
    );

    return {
      msg: 'Cantidad de utensilios actualizda exitosamente.',
      success: true,
      data: [],
    };
  } catch (error) {
    console.log('Error al actualizar utensilio. ->', error);
    return {
      msg: 'Error al actualizar utensilio.',
      success: false,
      data: error,
    };
  }
};

// services
const associateServicesToOrder = async (
  services,
  num_control,
  date_created
) => {
  let servicesSaved = [];
  try {
    const buildedServices = handleOrders.handleOrders.replaceIDWhereObj(
      services,
      'id_service',
      'id'
    );

    for (let element of buildedServices) {
      element.num_control = num_control;
      element.updateAt = date_created;
      const newServicePartners = new ModelOrdersServices(element);
      const saved = await newServicePartners.save();
      servicesSaved.push(saved);
    }

    return {
      msg: 'Servicios asociados exitosamente.',
      success: true,
      data: servicesSaved,
    };
  } catch (error) {
    console.log('error al asociar servicios a la orden ->', error);
    return {
      msg: 'Error al asociar servicios a la orden.',
      success: false,
      data: error,
    };
  }
};

const getServicesAssociateToOrder = async (numControl) => {
  let servicesAssociate = [];
  try {
    // buscamos los ids de los empleados asociados a la orden
    const employeeOfOrder = await ModelOrdersServices.findAll({
      where: {
        num_control: numControl,
      },
    });

    for (const iterator of employeeOfOrder) {
      const employee_data = await ModelServices.findAll({
        where: {
          id: iterator.id_service,
        },
      });

      servicesAssociate.push(employee_data[0]);
    }

    return {
      msg: 'Empleado(s) asociado(s) a la orden.',
      success: true,
      data: servicesAssociate,
    };
  } catch (error) {
    console.log('error al obtener empleados a la orden ->', error);
    return {
      msg: 'Error al obtener empleados a la orden.',
      success: false,
      data: error,
    };
  }
};

// employees
const associateEmployeesToOrder = async (
  employess,
  num_control,
  date_created
) => {
  let employeesSaved = [];
  try {
    const buildedEmployees = handleOrders.handleOrders.replaceIDWhereObj(
      employess,
      'id_employee',
      'id'
    );

    for (let element of buildedEmployees) {
      element.num_control = num_control;
      element.updateAt = date_created;
      const newEmployeePartners = new ModelOrdersEmployees(element);
      const saved = await newEmployeePartners.save();
      employeesSaved.push(saved);
    }

    return {
      msg: 'Empleado(s) asociado(s) exitosamente.',
      success: true,
      data: employeesSaved,
    };
  } catch (error) {
    console.log('error al asociar empleados a la orden ->', error);
    return {
      msg: 'Error al asociar empleados a la orden.',
      success: false,
      data: error,
    };
  }
};

const getEmployeeAssociateToOrderByNumControl = async (numControl) => {
  let employeesAssociate = [];
  try {
    // buscamos los ids de los empleados asociados a la orden
    const employeeOfOrder = await ModelOrdersEmployees.findAll({
      where: {
        num_control: numControl,
      },
    });

    for (const iterator of employeeOfOrder) {
      const employee_data = await ModelEmployee.findAll({
        where: {
          id: iterator.id_employee,
        },
      });

      employeesAssociate.push(employee_data[0]);
    }

    return {
      msg: 'Empleado(s) asociado(s) a la orden.',
      success: true,
      data: employeesAssociate,
    };
  } catch (error) {
    console.log('error al obtener empleados a la orden ->', error);
    return {
      msg: 'Error al obtener empleados a la orden.',
      success: false,
      data: error,
    };
  }
};

const getDataToRePrintOrder = async (id_order) => {
  try {
    // datos de la orden
    const dataOrder = await ModelOrders.findOne({ where: { id: id_order } });

    const payment_total_letter =
      handleOrders.handleOrders.converterNumsToLetters(dataOrder.payment_total);

    // buscamos datos del cliente
    const client = await getClientByID(dataOrder.id_client);

    // buscamos los Servicios
    const services = await getServicesByNumontrol(dataOrder.num_control);

    // buscamos las promociones
    const promotion = await servicesPromotions.getPromotionById(
      dataOrder.id_promotion
    );

    dataOrder.dataValues.payment_total_letter = payment_total_letter;
    dataOrder.dataValues.client = client.data;
    dataOrder.dataValues.services = services.data;
    dataOrder.dataValues.promotion = promotion.data;
    dataOrder.dataValues.ruc = process.env.RUCEMPRESA;

    return {
      msg: 'Cargando vista, por favor espere...',
      success: true,
      data: dataOrder,
    };
  } catch (error) {
    console.log('Error al obtener datos de la orden', error);
    return {
      msg: 'Error al obtener datos de la orden',
      success: false,
      data: [],
    };
  }
};

// emergencia
const getEmployeeByName = async (query) => {
  try {
    const matchesEmployees = await ModelEmployee.findAll({
      where: {
        name_employee: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    return {
      msg: 'Lista de empleados',
      success: true,
      data: matchesEmployees,
    };
  } catch (error) {
    console.log('Error al obtener empleados', error);
    return {
      msg: 'Error al obtener empleados',
      success: false,
      data: [],
    };
  }
};
// emergencia

module.exports = {
  searchProductsServicesAndEmployeesFromDB,
  associateCustomerToOrder,
  associateProductToOrder,
  associateServicesToOrder,
  getServicesAssociateToOrder,
  associateEmployeesToOrder,
  getOrderByNumControl,
  getEmployeeAssociateToOrderByNumControl,
  getCurrentOrders,
  annulateOrder,
  returnUtensilsToStock,
  getDataToRePrintOrder,
  getOrdersByIdEmployee,
  getOrdersByDateRange,
};
