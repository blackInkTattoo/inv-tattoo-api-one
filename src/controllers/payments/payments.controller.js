const { Op } = require('sequelize');
const paymentsServices = require('../../services/payments/payments.services');
const ModelPayment = require('../../models/payments/payemnts.model');
const handleOrders = require('../../utils/commonFunctions');
const {
  getEmployeeByID,
} = require('../../services/employess/employees.services');
const {
  getOrdersByIdEmployee,
  getServicesAssociateToOrder,
} = require('../../services/orders/searchProductsServicesAndEmployees.services');

const getPendingPaymentEmployeeById = async (req, res) => {
  const { id_employee, actual_date } = req.query;
  Number(id_employee);

  let result = [];

  /*
  
  1- primero buscar en pagos, la ultima fecha con pago "completo" dentro del rango de fechas y se le suma un dia
  2- verificar si hay un adelanto desde ultimo pago a la fecha de hoy
  2- buscar en ordenes todas las ordenes asociadas al empleado dentro del rango de fechas para obtener total
  4- registrar si fue pago "completo" o "avance"
  
  */

  // obtenemos el último pago completado del trabajador
  const lastPayment = await ModelPayment.findAll({
    where: {
      id_employee: id_employee,
      type_payment: 'completo',
    },
    order: [['id', 'DESC']],
  });

  const employee = await getEmployeeByID(id_employee);
  const dataEmployee = employee.data;

  const payments = await ModelPayment.findAll({
    where: {
      date_payment: {
        [Op.between]: [
          handleOrders.handleOrders.addDaysToDate(
            lastPayment[0]?.dataValues?.date_payment
              ? lastPayment[0]?.dataValues?.date_payment
              : lastPayment[0]?.dataValues?.last_date_payment
              ? lastPayment[0]?.dataValues?.last_date_payment
              : '2010-01-01'
          ),
          actual_date,
        ],
      },
      id_employee: id_employee,
    },
  });

  dataEmployee.dataValues.lastDatePayment = lastPayment[0]?.dataValues
    ?.date_payment
    ? lastPayment[0]?.dataValues?.date_payment
    : lastPayment[0]?.dataValues?.last_date_payment
    ? lastPayment[0]?.dataValues?.last_date_payment
    : '2010-01-01';
  dataEmployee.dataValues.totalCancelated = lastPayment[0]?.dataValues
    ?.amount_payment
    ? lastPayment[0]?.dataValues?.amount_payment
    : 0;

  if (payments.length > 0) {
    dataEmployee.dataValues.payments = payments;
    dataEmployee.dataValues.totalAdvances = payments.reduce(
      (acc, el) => acc + el.amount_payment,
      0
    );
  }

  // buscamos ordenes
  const orderForEmployee = await getOrdersByIdEmployee(
    id_employee,
    handleOrders.handleOrders.addDaysToDate(
      lastPayment[0]?.dataValues?.date_payment
        ? lastPayment[0]?.dataValues?.date_payment
        : lastPayment[0]?.dataValues?.last_date_payment
        ? lastPayment[0]?.dataValues?.last_date_payment
        : '2010-01-01'
    ),
    actual_date
  );

  // buscamos descripcion de ordenes
  let orderWithDescriptionsServices = [];
  for (const order of orderForEmployee.data) {
    if (order) {
      const descriptionsOrders = await getServicesAssociateToOrder(
        order.num_control
      );

      order.dataValues.services = descriptionsOrders.data;

      orderWithDescriptionsServices.push(order);
    }
  }

  // ---------------------------------

  dataEmployee.dataValues.orders = orderWithDescriptionsServices;
  dataEmployee.dataValues.num_orders = orderWithDescriptionsServices.length;

  dataEmployee.dataValues.totalOrders = orderWithDescriptionsServices.reduce(
    (acc, el) => (el?.payment_total ? acc + el.payment_total : 0),
    0
  );

  dataEmployee.dataValues.accumulationAdvances =
    dataEmployee.dataValues.totalOrders - dataEmployee.dataValues.totalAdvances;

  if (
    dataEmployee.dataValues.fixed_payment &&
    dataEmployee.dataValues.totalOrders <= 0
  ) {
    dataEmployee.dataValues.totalToPayment =
      dataEmployee.fixed_payment - dataEmployee.dataValues.totalAdvances;
  } else {
    dataEmployee.dataValues.totalToPayment =
      handleOrders.handleOrders.calculatePaymentTotal(
        dataEmployee,
        dataEmployee.dataValues.totalAdvances,
        dataEmployee.dataValues.totalOrders
      );
  }

  result.push(dataEmployee);

  // const lastPaymentCompleted = await ModelPayment.findOne({
  //   where: {
  //     id_employee: id_employee,
  //     type_payment: 'completo',
  //   },
  // });

  // console.log(
  //   'lastPaymentCompleted controller --------------------->',
  //   lastPaymentCompleted[0]
  // );

  // obtener numeros de control de las ordenes asociadas al empleados
  // validar que desde el ultimo pago completo hasta la fecha actual no hayan pagos.
  // const ordersAssociateToEmployee =
  //   await paymentsServices.getEmployeeAssociateToOrderById({
  //     id_employee,
  //     start_date: handleOrders.handleOrders.addDaysToDate(
  //       lastPaymentCompleted[0]?.dataValues?.date_payment
  //         ? lastPaymentCompleted[0]?.dataValues?.date_payment
  //         : '2010-01-01'
  //       // handleOrders.handleOrders.addDaysToDate(actual_date, -8)
  //     ),
  //     end_date: actual_date,
  //   });

  // // obtener las ordenes asociadas al trabajador en un rango de fechas descontando los adelantos.
  // const totalToPayment = await paymentsServices.getTotalOrdersForEmpployee(
  //   ordersAssociateToEmployee?.data?.employeeDataAssociate?.length
  //     ? ordersAssociateToEmployee?.data?.employeeDataAssociate
  //     : id_employee,
  //   handleOrders.handleOrders.addDaysToDate(
  //     lastPaymentCompleted[0]?.dataValues?.date_payment
  //       ? lastPaymentCompleted[0]?.dataValues?.date_payment
  //       : '2010-01-01'
  //     // handleOrders.handleOrders.addDaysToDate(actual_date, -8)
  //   ),
  //   // handleOrders.handleOrders.addDaysToDate(
  //   //   lastPaymentCompleted[0]?.dataValues?.date_payment
  //   //     ? lastPaymentCompleted[0].dataValues.date_payment
  //   //     : handleOrders.handleOrders.addDaysToDate(actual_date, -8)
  //   // ),
  //   actual_date
  // );

  // /* ----------------------------------- */

  // // totalToPayment.data.descriptionServices =
  // //   ordersAssociateToEmployee?.data?.descriptionServices;

  // /* ----------------------------------- */

  // totalToPayment.data.ordersData =
  //   ordersAssociateToEmployee.data.resultDataOrders;

  // totalToPayment.data.lastPaymentCompleted = lastPaymentCompleted[0];

  res.json({ msg: '', success: true, data: result[0] });
};

const registerPaymentEmployee = async (req, res) => {
  const paymentSaved = await paymentsServices.savePaymentEmployee(req.body);
  res.json(paymentSaved);
};

const getReportsPayment = async (req, res) => {
  const { date } = req.query;
  const paymentsList = await paymentsServices.getReportPayment(date);
  res.json(paymentsList);
};

const getReportsPaymentPaid = async (req, res) => {
  const paymentsList = await paymentsServices.getPaymentsCompleted();
  res.json(paymentsList);
};

const paymentServices = {
  getPendingPaymentEmployeeById,
  registerPaymentEmployee,
  getReportsPayment,
  getReportsPaymentPaid,
};

module.exports = paymentServices;
