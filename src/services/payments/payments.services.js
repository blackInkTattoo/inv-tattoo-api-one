const { Op } = require('sequelize');
const ModelPayment = require('../../models/payments/payemnts.model');
const ModelEmployee = require('../../models/employess/employess.model');
const ModelOrdersEmployees = require('../../models/orders/ordersEmployees.model');
const ModelOrders = require('../../models/orders/orders.model');
const ModelOrdersServices = require('../../models/orders/orsersServices.model');
const ModelServices = require('../../models/services/services.model');
const handleOrders = require('../../utils/commonFunctions');
const {
  getOrdersByIdEmployee,
} = require('../orders/searchProductsServicesAndEmployees.services');
// const { getAllEmployeeHaladores } = require('../employess/employees.services');
// const employeesServices = require('../employess/employees.services');

// -----------------------------------------------------------------------------

const getNumsPayments = async () => {
  try {
    // const numPayments = await ModelPayment.count();

    const lastIdPayments = await ModelPayment.findAll({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return {
      msg: 'Número de pagos',
      success: true,
      data: lastIdPayments[0]?.dataValues ? lastIdPayments[0].dataValues.id : 0,
    };
  } catch (error) {
    console.log('Error al obtener números de pagos ->', error);
    return {
      msg: 'Error al obtener números de pagos',
      success: false,
      data: error,
    };
  }
};

// obtener el ultimo registro de pago completo de la tabla pagos
const lastPaymentCompleted = async (idEmployee) => {
  try {
    const lastPayment = await ModelPayment.findOne({
      where: {
        id_employee: idEmployee,
        type_payment: 'completo',
      },
    });

    return {
      msg: 'Ultimo pago completo de empleado',
      success: true,
      data: lastPayment,
    };
  } catch (error) {
    console.log('Error al buscar ultimo pago completo ->', error);
    return {
      msg: 'Error al buscar último pago completo.',
      success: false,
      data: error,
    };
  }
};

// validar fecha del ultimo pago no sea el mismo dia actual
const validateDateLastPayment = async (dateToValidate, id_employee, res) => {
  if (
    dateToValidate.date_payment >=
      handleOrders.handleOrders.addDaysToDate('', -8) &&
    dateToValidate.date_payment <= handleOrders.handleOrders.getActualDate()
  ) {
    const data = {};
    const employee = await getEmployeeByID(id_employee);
    data.id_employee = employee.data[0].id;
    data.last_payment = dateToValidate.date_payment;
    data.actual_date = handleOrders.handleOrders.getActualDate();
    data.total = 0;
    data.details = employee.data[0];

    return res.json({
      msg: 'No hay pagos pendientes,',
      success: true,
      data: data,
    });
  }

  return;
};

// obtener todas las ordenes asociadas al trabajador en un rango de fecha
const getEmployeeAssociateToOrderById = async (data) => {
  const { id_employee, start_date, end_date } = data;

  let resultDataOrders = [];
  let resultServices = [];
  let descriptionServices = [];

  // buscamos los numeros de control asociados al empleado
  try {
    const employeeDataAssociate = await ModelOrdersEmployees.findAll({
      where: {
        id_employee: id_employee,
        updateAt: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    // buscamos las ordenes
    for (const order of employeeDataAssociate) {
      const dataOrder = await ModelOrders.findAll({
        where: {
          num_control: order.num_control,
          state_null: JSON.parse(false),
        },
      });

      // buscamos los servicios asociados a las ordenes
      if (dataOrder[0]) {
        const servicesAssociated = await ModelOrdersServices.findOne({
          where: { num_control: dataOrder[0].num_control },
        });

        const desService = await ModelServices.findOne({
          where: { id: servicesAssociated.id_service },
        });

        let orderCopy = { ...dataOrder[0].dataValues };

        orderCopy.service = desService.dataValues.description_service;
        resultDataOrders.push(orderCopy);
      }
    }

    // buscamos la descripcion de los servicios
    // for (const service of resultServices) {
    //   const serviceDesc = await ModelServices.findOne({
    //     where: { id: service.id_service },
    //   });

    //   descriptionServices.push(serviceDesc);
    // }

    // descriptionServices =
    //   handleOrders.handleOrders.deleteItemsRepitedById(descriptionServices);

    return {
      msg: 'Empleado asociado a la orden.',
      success: true,
      data: { employeeDataAssociate, resultDataOrders, descriptionServices },
    };
  } catch (error) {
    console.log('error al obtener empleado asociado a la orden ->', error);
    return {
      msg: 'error al obtener empleado asociado a la orden.',
      success: false,
      data: error,
    };
  }
};

// obtener el total a pagar segun las ordenes en un rango de fechas
const getTotalOrdersForEmpployee = async (data, start_date, end_date) => {
  let result = [];
  let total = 0;
  let totalAdvanced = 0;
  let totalToPayEmployee = {};

  try {
    if (Array.isArray(data)) {
      for (const iterator of data) {
        const dataOrdersAssociateToEmployee = await ModelOrders.findAll({
          where: {
            num_control: iterator.num_control,
            updateAt: iterator.updateAt,
            state_null: JSON.parse(false),
          },
        });

        dataOrdersAssociateToEmployee[0] &&
          result.push(dataOrdersAssociateToEmployee[0]);
      }

      totalOrders = handleOrders.handleOrders.addAmountsOfObjects(
        result,
        'payment_total'
      );

      // console.log('data ---------------------------------->', data);

      // verificar si en ese rango de fechas hay algun adelanto
      const advancesForEmployee = await paymentsServices.validateAdvanceByDates(
        data[0].id_employee,
        start_date,
        end_date
      );

      totalAdvanced = handleOrders.handleOrders.addAmountsOfObjects(
        advancesForEmployee.data,
        'amount_payment'
      );

      totalToPayEmployee = {
        id_employee: data[0].id_employee,
        last_payment: start_date,
        actual_date: end_date,
        total: totalOrders ? totalOrders : 0,
        advances: advancesForEmployee.data,
      };
    } else {
      totalToPayEmployee = {
        id_employee: Number(data),
        last_payment: start_date,
        actual_date: end_date,
        total: totalOrders ? totalOrders : 0,
      };
    }

    // obtener informacion basica del empleado
    const infoEmployee = await getEmployeeByID(totalToPayEmployee.id_employee);
    totalToPayEmployee.details = infoEmployee.data[0];

    // Validar el tipo de pago del trabajador y sacar los calculos, si es por porcentaje, pago fijo o ambas
    totalToPayEmployee.total = handleOrders.handleOrders.calculatePaymentTotal(
      infoEmployee.data[0],
      totalAdvanced,
      totalOrders
    );

    return {
      msg: 'Total a pagar a empleado.',
      success: true,
      data: totalToPayEmployee,
    };
  } catch (error) {
    console.log(
      'error al obtener data de la order segun el numero de control asociado al empleado. ->',
      error
    );
    return {
      msg: 'error al obtener data de la order segun el numero de control asociado al empleado.',
      success: false,
      data: error,
    };
  }
};

// obtener todos los adelantos hechos a los trabajadores en un rango de fechas
const getTotalAdvancesForEmployees = async (start_date, end_date) => {
  try {
    const advances = await ModelPayment.findAll({
      where: {
        // type_payment: 'adelanto',
        date_payment: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    return {
      msg: 'adelantos',
      success: true,
      data: advances,
    };
  } catch (error) {
    console.log('error al obtener adelantos ->', error);
    return {
      msg: 'error al obtener adelantos',
      success: false,
      data: error,
    };
  }
};

// buscar adelantos de pagos en un rango de fechas
const validateAdvanceByDates = async (idEmployee, start_date, end_date) => {
  try {
    // buscamos desde la ultima fecha donde se hizo un adelanto.
    const lastDateAdvance = await ModelPayment.findAll({
      where: {
        id_employee: idEmployee,
        type_payment: 'adelanto',
        date_payment: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    if (lastDateAdvance)
      return {
        msg: 'existe adelanto',
        success: true,
        data: lastDateAdvance,
      };

    // en caso de no existir adelanto buscamos por fechas
    const registerPayment = await ModelPayment.findAll({
      where: {
        id_employee: idEmployee,
        date_payment: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    return { msg: 'lista de pagos.', success: true, data: registerPayment };
  } catch (error) {
    console.log('error al buscar registro de pago de empleado ->', error);
    return {
      msg: 'Error al buscar registro de pago de empleado.',
      success: false,
      data: error,
    };
  }
};

// obtener los pagos asociados al empleado segun id_employee y fecha
const getEmployeeAssociateToPaymentByDate = async (
  idEmployee,
  start_date,
  end_date
) => {
  try {
    const listPayments = await ModelPayment.findOne({
      where: {
        id_employee: idEmployee,
        date_payment: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    return {
      msg: 'lista de pagos asociados',
      success: true,
      data: listPayments,
    };
  } catch (error) {
    console.log('Error al obtener lista de pagos asociados', error);
    return {
      msg: 'Error al obtener lista de pagos asociados',
      success: false,
      data: error,
    };
  }
};

const savePaymentEmployee = async (data) => {
  try {
    data.num_pago =
      await handleOrders.handleOrders.generateNewNumberControlPayment();

    // buscamos la ultima fecha de pago
    const lastPaymentCompleted = await ModelPayment.findAll({
      where: {
        id_employee: data.id_employee,
        type_payment: 'completo',
      },
      order: [['id', 'DESC']],
    });

    if (lastPaymentCompleted.length <= 0) {
      data.last_date_payment = '2010-01-01';
    } else {
      data.last_date_payment = lastPaymentCompleted[0].dataValues.date_payment;
    }

    // buscamos pago completo
    // const firstPayment = await ModelPayment.findOne({
    //   where: {
    //     id_employee: data.id_employee,
    //     type_payment: 'primer_pago',
    //   },
    // });

    // if (!firstPayment) {
    //   let newCompleted = {
    //     num_pago: 'NP-0',
    //     amount_payment: 0,
    //     id_employee: data.id_employee,
    //     type_payment: 'primer_pago',
    //     date_payment: data.date,
    //     last_date_payment: data.date,
    //   };

    //   const addNewCompleted = new ModelPayment(newCompleted);
    //   const newCompletedCreted = await addNewCompleted.save();

    //   data.last_date_payment = newCompletedCreted.date_payment;

    // } else {
    //   data.last_date_payment = firstPayment.date_payment;
    // }

    const addAdvance = new ModelPayment(data);
    const savedPayment = await addAdvance.save();

    // buscamos los datos del empleado
    const employee_details = await getEmployeeByID(data.id_employee);

    savedPayment.dataValues.employee_details = employee_details.data[0];
    savedPayment.dataValues.amount_to_letter =
      handleOrders.handleOrders.converterNumsToLetters(data.amount_payment);

    // buscamos ordenes del empleado
    const { id_employee } = savedPayment;

    const ordersAssociateToEmployee = await getEmployeeAssociateToOrderById({
      id_employee,
      start_date: handleOrders.handleOrders.addDaysToDate(
        lastPaymentCompleted[0]?.date_payment
          ? lastPaymentCompleted[0].date_payment
          : handleOrders.handleOrders.addDaysToDate(data.date, -8)
      ),
      end_date: data.date,
    });

    savedPayment.dataValues.ordersAssociateToEmployee =
      ordersAssociateToEmployee.data;
    savedPayment.dataValues.fecha = data.date;
    savedPayment.dataValues.ruc = process.env.RUCEMPRESA;

    return {
      msg: 'Pago registrado con éxito.',
      success: true,
      data: savedPayment,
    };
  } catch (error) {
    console.log('Error al registrar pago de pago ->', error);
    return {
      msg: 'Error al registrar pago.',
      success: false,
      data: error,
    };
  }
};

// obtener reportes de pagos
const getReportPayment = async (end_date) => {
  try {
    let result = [];
    const buildingData = {};

    // obtenemos lista de empleados
    const { data } = await getEmployees();

    for (const employee of data) {
      // ultimo pago completo
      const lastPayment = await ModelPayment.findAll({
        where: {
          id_employee: employee.id,
          type_payment: 'completo',
        },
        order: [['id', 'DESC']],
      });

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
              end_date,
            ],
          },
          id_employee: employee.id,
        },
      });

      employee.dataValues.lastDatePayment = lastPayment[0]?.dataValues
        ?.date_payment
        ? lastPayment[0]?.dataValues?.date_payment
        : lastPayment[0]?.dataValues?.last_date_payment
        ? lastPayment[0]?.dataValues?.last_date_payment
        : '2010-01-01';
      employee.dataValues.totalCancelated =
        lastPayment[0]?.dataValues?.amount_payment;

      if (payments.length > 0) {
        employee.dataValues.payments = payments;
        employee.dataValues.totalAdvances = payments.reduce(
          (acc, el) => acc + el.amount_payment,
          0
        );
      }

      // buscamos ordenes
      const orderForEmployee = await getOrdersByIdEmployee(
        employee.id,
        handleOrders.handleOrders.addDaysToDate(
          lastPayment[0]?.dataValues?.date_payment
            ? lastPayment[0]?.dataValues?.date_payment
            : lastPayment[0]?.dataValues?.last_date_payment
            ? lastPayment[0]?.dataValues?.last_date_payment
            : '2010-01-01'
        ),
        end_date
      );

      employee.dataValues.orders = orderForEmployee.data;
      employee.dataValues.num_orders = orderForEmployee.data.length;

      employee.dataValues.totalOrders = orderForEmployee.data.reduce(
        (acc, el) => (el?.payment_total ? acc + el.payment_total : 0),
        0
      );

      // employee.dataValues.accumulationAdvances =
      //   employee.dataValues.totalOrders - employee.dataValues.totalAdvances;

      if (employee.fixed_payment && employee.dataValues.totalOrders <= 0) {
        employee.dataValues.totalToPayment =
          employee.fixed_payment - employee.dataValues.totalAdvances;
      } else {
        employee.dataValues.totalToPayment =
          handleOrders.handleOrders.calculatePaymentTotal(
            employee,
            employee.dataValues.totalAdvances,
            employee.dataValues.totalOrders
          );
      }

      // if (orderForEmployee.data.length > 0) {
      //   employee.dataValues.totalOrders =
      //     handleOrders.handleOrders.addAmountsOfObjects(
      //       orderForEmployee.data,
      //       'payment_total'
      //     );
      // } else {
      //   employee.dataValues.totalOrders = 0;
      // }

      // employee.dataValues.totalOrders =
      //   orderForEmployee.data.length <= 0
      //     ? 0
      //     : handleOrders.handleOrders.addAmountsOfObjects(
      //         orderForEmployee.data,
      //         'payment_total'
      //       );

      result.push(employee);
    }

    // SELECT * FROM `payments` WHERE id_employee = 1 ORDER BY `id` DESC;

    // for (const employee of data) {
    //   // ultimo pago completo
    //   const lastPayment = await ModelPayment.findAll({
    //     where: {
    //       id_employee: employee.id,
    //       type_payment: 'completo',
    //     },
    //     order: [['id', 'DESC']],
    //   });

    //   //lastPaymentCompleted(employee.id);

    //   if (employee.id === 1) {
    //     console.log('lastPayment ->', lastPayment);
    //   }

    //   if (lastPayment[0]?.dataValues?.last_date_payment) {
    //     const payments = await ModelPayment.findAll({
    //       where: {
    //         date_payment: {
    //           [Op.between]: [
    //             lastPayment[0]?.dataValues?.date_payment
    //               ? lastPayment[0]?.dataValues?.date_payment
    //               : lastPayment[0]?.dataValues?.last_date_payment,
    //             start_date,
    //           ],
    //         },
    //         id_employee: lastPayment[0]?.dataValues?.id_employee,
    //       },
    //     });

    //     const totalAdvances = payments.reduce(
    //       (acc, el) =>
    //         el.type_payment === 'adelanto' ? acc + el.amount_payment : acc,
    //       0
    //     );

    //     const totalPaymentCompleted = payments.filter(
    //       (item) => item.type_payment === 'completo'
    //     )[0].amount_payment;

    //     employee.dataValues.totalPaymentCompleted = totalPaymentCompleted;

    //     // buscamos ordenes asociadas al empleado
    //     const orders = await getOrdersByIdEmployee(
    //       employee.id,
    //       handleOrders.handleOrders.addDaysToDate(
    //         lastPayment[0]?.dataValues?.last_date_payment
    //       ),
    //       lastPayment[0]?.dataValues?.date_payment
    //     );

    //     // totales pagados de las ordenes
    //     const totalOrders = orders.data.reduce(
    //       (acc, el) => acc + el.payment_total,
    //       0
    //     );

    //     // total a pagar
    //     const totalToPayment = handleOrders.handleOrders.calculatePaymentTotal(
    //       employee,
    //       totalAdvances,
    //       totalOrders
    //     );

    //     employee.dataValues.start_date =
    //       lastPayment[0]?.dataValues?.last_date_payment;
    //     employee.dataValues.end_date = lastPayment[0]?.dataValues?.date_payment;

    //     // employee.dataValues.totalToPayment =
    //     //   totalPaymentCompleted === totalToPayment ? 0 : totalToPayment;
    //     employee.dataValues.totalToPayment = totalToPayment;

    //     employee.dataValues.payments = payments;

    //     employee.dataValues.totalAdvances = totalAdvances;

    //     employee.dataValues.orders = orders.data;
    //     employee.dataValues.numOrders = orders.data.length;
    //     employee.dataValues.totalOrders = totalOrders;

    //     result.push(employee);
    //   }
    // }

    const resultFilteres = result.filter(
      (item) => item.dataValues.totalToPayment !== 0
    );

    buildingData.result = resultFilteres;
    buildingData.ruc = process.env.RUCEMPRESA;

    return {
      msg: 'Lista de pagos',
      success: true,
      data: buildingData,
    };
  } catch (error) {
    console.log('Error al buscar lista de pagos ->', error);
    return {
      msg: 'Error al buscar lista de pagos',
      success: false,
      data: [],
    };
  }
};

const getPaymentsCompleted = async () => {
  try {
    let result = [];
    const buildingData = {};

    // obtenemos lista de empleados
    const { data } = await getEmployees();

    for (const employee of data) {
      // ultimo pago completo
      const lastPayment = await ModelPayment.findAll({
        where: {
          id_employee: employee.id,
          type_payment: 'completo',
        },
        order: [['id', 'DESC']],
      });

      if (lastPayment[0]?.dataValues) {
        employee.dataValues.payments = lastPayment[0]?.dataValues;
        result.push(employee);
      }
    }

    buildingData.result = result;
    buildingData.ruc = process.env.RUCEMPRESA;

    return {
      msg: 'Lista de pagos',
      success: true,
      data: buildingData,
    };
  } catch (error) {
    console.log('Error al buscar lista de pagos ->', error);
    return {
      msg: 'Error al buscar lista de pagos',
      success: false,
      data: [],
    };
  }
};

const getPaymentCompletedHaladores = async (start_date, end_date) => {
  try {
    let result = [];

    const employeeHaladores = await getAllEmployeeHaladores();

    for (const employee of employeeHaladores.data) {
      const lastPaymenCompletedEmployee = await ModelPayment.findAll({
        where: {
          id_employee: employee.id,
          type_payment: 'completo',
          date_payment: {
            [Op.between]: [start_date, end_date],
          },
        },
        order: [['id', 'DESC']],
      });

      console.log(
        'lastPaymenCompletedEmployee[0]?.dataValues ->',
        lastPaymenCompletedEmployee[0]?.dataValues
      );

      result.push(
        lastPaymenCompletedEmployee[0]?.dataValues
          ? lastPaymenCompletedEmployee[0]?.dataValues?.amount_payment
          : 0
      );
    }

    const totalPaymentCompleted = result.reduce((acc, el) => acc + el, 0);

    return {
      msg: 'Total de pagos completos de los haladores',
      success: true,
      data: totalPaymentCompleted,
    };
  } catch (error) {
    console.log("'Error al buscar pagos completos haladores'", error);
    return {
      msg: 'Error al buscar pagos completos haladores',
      success: false,
      data: [],
    };
  }
};

// emergency
const getEmployeeByID = async (id_employee) => {
  try {
    const matchesEmployees = await ModelEmployee.findAll({
      where: {
        id: id_employee,
      },
    });

    return {
      msg: 'Empleado.',
      success: true,
      data: matchesEmployees,
    };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener empleado', msgError);

    return {
      msg: msgError || 'Error al obtener empleado',
      success: false,
      data: error,
    };
  }
};

const getEmployees = async () => {
  try {
    const allE = await ModelEmployee.findAll();
    return {
      msg: 'Todos los empleados.',
      success: true,
      data: allE,
    };
  } catch (error) {
    console.log('Error al obtener empleados', error);
    return {
      msg: 'Error al obtener empleados',
      success: false,
      data: error,
    };
  }
};

// emergency
const getAllEmployeeHaladores = async () => {
  try {
    const employeeHaladores = await ModelEmployee.findAll({
      where: {
        type_employee: 'halador',
      },
    });

    return {
      msg: 'Lista empleados haladores',
      success: true,
      data: employeeHaladores,
    };
  } catch (error) {
    console.log('Error al buscar empleados haladores', error);
    return {
      msg: 'Error al buscar empleados haladores',
      success: false,
      data: error,
    };
  }
};

// emergency

const paymentsServices = {
  lastPaymentCompleted,
  validateDateLastPayment,
  getEmployeeAssociateToOrderById,
  getTotalOrdersForEmpployee,
  validateAdvanceByDates,
  savePaymentEmployee,
  getTotalAdvancesForEmployees,
  getNumsPayments,
  getEmployeeAssociateToPaymentByDate,
  getReportPayment,
  getPaymentsCompleted,
  getPaymentCompletedHaladores,
};

module.exports = paymentsServices;
