const { Op } = require('sequelize');
const ModelOrders = require('../../models/orders/orders.model');
const ModelInventary = require('../../models/products/product.model');
const ModelBuys = require('../../models/buys/buys.model');
const ModelOrdersProducts = require('../../models/orders/ordersProducts.model');
const handleOrders = require('../../utils/commonFunctions');
const paymentsServices = require('../payments/payments.services');
const {
  getTotalAdvances,
  buildAvancesEmployee,
} = require('../employess/employees.services');
const expendituresService = require('../expenditures/expenditures.service');
const buyService = require('../buys/buy.service');
const {
  getOrdersByDateRange,
} = require('../orders/searchProductsServicesAndEmployees.services');
const { getProductFromDBByID } = require('../inventary/inventary.services');

const getDialyReports = async (date, end_date) => {
  const data = {};

  try {
    const currenlyOrders = await ModelOrders.findAll({
      where: {
        updateAt: {
          [Op.between]: [date, end_date ? end_date : date],
        },
      },
    });

    if (!currenlyOrders) {
      return {
        msg: 'No hay ordenes registradas para esta(s) fecha(s).',
        success: false,
        data: [],
      };
    }

    const dataOrdersWithEmployeesAndServicesAssociated =
      await handleOrders.handleOrders.getTotalofOrdersByTypePayment(
        currenlyOrders
      );

    data.dataOrdersWithEmployeesAndServicesAssociated =
      dataOrdersWithEmployeesAndServicesAssociated;

    // totales por tipo de pago
    const objectTotalsByPayment =
      handleOrders.handleOrders.calculateTotalsByTypePayment(
        dataOrdersWithEmployeesAndServicesAssociated
      );

    data.totalCashWithOutDeductions = objectTotalsByPayment.cash;
    data.objectTotalsByPayment = objectTotalsByPayment;

    // buscamos haladores, con ultimo pago completo
    const totalPaymentsCompleteEmployeeHaladores =
      await paymentsServices.getPaymentCompletedHaladores(
        date,
        end_date ? end_date : date
      );

    data.totalPaymentsCompleteEmployeeHaladores =
      totalPaymentsCompleteEmployeeHaladores.data;

    // buscamos los adelantos por empleado.
    const AdvancesEmpleados =
      await paymentsServices.getTotalAdvancesForEmployees(
        date,
        end_date ? end_date : date
      );

    data.AdvancesEmpleados = AdvancesEmpleados.data;

    const totalsAdvanceCash = getTotalAdvances(AdvancesEmpleados.data);

    data.totalsAdvanceCash = totalsAdvanceCash;

    /* */

    const dataAdvanceEmployee = await buildAvancesEmployee(
      AdvancesEmpleados?.data,
      date,
      end_date ? end_date : date
    );

    data.dataAdvanceEmployee = dataAdvanceEmployee;

    // filtramos los pagos de los empleados por tipo de pago y tipo empleado
    /*
      lo que se va a mostrar en el reporte pagos completos de haladores, adelantos de tatuadores, haladores

      lo que no se va a mostrar son los pagos completo de los tatuadores
      
    */

    // LA MARDICIOOOON DE LAS MARDICIONESSS!!!!!!!!!!!!!!!!

    // const filtered = [];

    // AdvancesEmpleados.data.forEach((employee) => {
    //   const { type_employee, type_payment } = employee.dataValues;

    //   if (
    //     (type_payment === 'completo' && type_employee === 'halador') ||
    //     (type_payment === 'adelanto' && type_employee === 'halador') ||
    //     (type_payment === 'adelanto' && type_employee === 'tatuador')
    //   ) {
    //     filtered.push(employee);
    //   }
    // });

    // data.filtered = filtered;

    data.AdvancesEmpleados = AdvancesEmpleados.data.filter((employee) => {
      const { type_employee, type_payment } = employee.dataValues;
      if (
        (type_payment === 'completo' && type_employee === 'halador') ||
        (type_payment === 'adelanto' && type_employee === 'halador') ||
        (type_payment === 'adelanto' && type_employee === 'tatuador')
      ) {
        return employee;
      }
    });

    /* */

    // total gastos
    const expendituresList = await expendituresService.getCurrentExpenditures(
      date,
      end_date ? end_date : date
    );

    // arreglo de gastos
    data.expendituresList = expendituresList.data;

    // total de gasto
    const totalExpenditures =
      await expendituresService.getTotalAmountExpenditures(
        expendituresList.data
      );

    data.totalExpenditures = totalExpenditures;

    // * buscamos las compras
    // const buysList = await buyService.getCurrentBuys(date, end_date);
    // data.buysList = buysList.data;
    data.buysList = [];

    // * total de compras
    // data.totalBuys = buyService.getTotalAmountBuys(buysList.data);

    // restamos adelantos y gastos al efectivo
    data.objectTotalsByPayment.cash = data?.objectTotalsByPayment?.cash
      ? handleOrders.handleOrders.restAdvancesAndExpenditures(
          data?.objectTotalsByPayment?.cash,
          totalsAdvanceCash,
          totalExpenditures,
          totalPaymentsCompleteEmployeeHaladores.data
        )
      : 0;

    data.total_orders_amount = handleOrders.handleOrders.addObject(
      objectTotalsByPayment
    );

    // // buscamos los gastos
    // const expendituresList = await expendituresService.getCurrentExpenditures(
    //   date,
    //   end_date ? end_date : date
    // );

    // data.expendituresList = expendituresList.data;

    // // buscamos el total de gastos
    // const totalExpenditures =
    //   await expendituresService.getTotalAmountExpenditures(
    //     expendituresList.data
    //   );

    // const dataOrdersWithEmployeesAndServicesAssociated =
    //   await handleOrders.handleOrders.getTotalofOrdersByTypePayment(
    //     currenlyOrders
    //   );

    // data.dataOrdersWithEmployeesAndServicesAssociated =
    //   dataOrdersWithEmployeesAndServicesAssociated;

    // // // crear totales por pago
    // const objectTotalsByPayment =
    //   handleOrders.handleOrders.calculateTotalsByTypePayment(
    //     dataOrdersWithEmployeesAndServicesAssociated
    //   );

    // data.objectTotalsByPayment = objectTotalsByPayment;

    // // //buscamos los avances por nombres de cada uno de los empleados
    // const dataAdvanceEmployee = await employeeServices.buildAvancesEmployee(
    //   AdvancesEmpleados?.data,
    //   date,
    //   end_date ? end_date : date
    // );

    // const totalsAdvanceCash = handleOrders.handleOrders.addAmountsOfObjects(
    //   dataAdvanceEmployee,
    //   'amount_payment'
    // );

    // // restamos adelantos y gastos al efectivo
    // data.objectTotalsByPayment.cash = data?.objectTotalsByPayment?.cash
    //   ? handleOrders.handleOrders.restAdvancesAndExpenditures(
    //       data?.objectTotalsByPayment?.cash,
    //       totalsAdvanceCash,
    //       totalExpenditures
    //     )
    //   : 0;

    // data.total_orders_amount = handleOrders.handleOrders.addObject(
    //   objectTotalsByPayment
    // );

    // data.total_advances_data = AdvancesEmpleados.data;
    // data.dataAdvanceEmployee = dataAdvanceEmployee.data; /* * */

    data.num_orders = currenlyOrders.length;

    data.date = date;
    data.end_date = end_date;
    data.ruc = process.env.RUCEMPRESA;

    if (currenlyOrders.length) {
      return {
        msg: 'Cargando vista, por favor espere...',
        success: true,
        data: data,
      };
    } else {
      return {
        msg: 'No hay ordenes registradas para el dia de hoy.',
        success: false,
        data: [],
      };
    }
  } catch (error) {
    // const errorFormated = buildHandleError(error);
    console.log('Error al obtener datos del dia de hoy ->', error);
    return {
      msg: 'Error al obtener datos del dia de hoy.',
      success: false,
      data: error,
    };
  }
};

// inventary
const getInventaryGeneral = async () => {
  const data = {};

  try {
    const currenlyInventary = await ModelInventary.findAll();

    data.num_products = currenlyInventary.length;
    data.inventary_list = currenlyInventary;
    data.date = handleOrders.handleOrders.getActualDate();
    data.ruc = process.env.RUCEMPRESA;

    if (currenlyInventary.length) {
      return {
        msg: 'Cargando vista, por favor espere.',
        success: true,
        data: data,
      };
    } else {
      return {
        msg: 'No hay registradas para crear inventario.',
        success: false,
        data: [],
      };
    }
  } catch (error) {
    // const errorFormated = buildHandleError(error);
    console.log('Error al obtener productos del dia de hoy ->', error);
    return {
      msg: 'Datos del dia de hoy',
      success: false,
      data: error,
    };
  }
};

const getInventaryByDate = async (date, end_date) => {
  const data = {};
  let arrProductAssociatedToOrder = [];

  try {
    // * 1) buscamos las ordenes segun el rango de fecha.
    const currentOrders = await getOrdersByDateRange(date, end_date);

    // * buscamos los productos asociados a las ordenes
    for (const order of currentOrders.data) {
      const currentProductOrder = await ModelOrdersProducts.findAll({
        where: {
          num_control: order.num_control,
          updateAt: {
            [Op.between]: [date, end_date ? end_date : date],
          },
        },
      });

      const productsList = [];

      // * obtenemos los datos de los productos
      for (let product of currentProductOrder) {
        const productDetails = await getProductFromDBByID(product.id_product);

        if (productDetails?.data?.dataValues) {
          let data = productDetails?.data.dataValues;
          product = { ...product.dataValues, ...data };
          productsList.push(product);
        }
      }

      order.dataValues.products = productsList;
      arrProductAssociatedToOrder.push(order);
    }

    // * obtenemos las compras por el rango de fechas
    const currentBuys = await ModelBuys.findAll({
      where: {
        createdAt: {
          [Op.between]: [date, end_date ? end_date : date],
        },
      },
    });

    // // * 2) Buscar si hay compras de productos entre las fechas
    // const currenlyInventary = await ModelInventary.findAll({
    //   where: {
    //     updatedAt: {
    //       [Op.between]: [
    //         `${date} 00:00:00`,
    //         end_date ? `${end_date} 00:00:00` : `${date} 00:00:00`,
    //       ],
    //     },
    //   },
    // });

    // // * 3) compras
    // const currentBuys = await ModelBuys.findAll({
    //   where: {
    //     createdAt: {
    //       [Op.between]: [date, end_date ? end_date : date],
    //     },
    //   },
    // });

    // const newArrInventary = currenlyInventary.reduce((acc, el) => {
    //   const buysList = currentBuys.filter(
    //     (buy) => buy.dataValues.id_utils === el.id
    //   );
    //   // TODO validar si no hay compras
    //   el = { ...el.dataValues, buysList };
    //   acc.push(el);
    //   return acc;
    // }, []);

    // // * salidas de productos
    // for (const product of newArrInventary) {
    //   const currentProductOrder = await ModelOrdersProducts.findAll({
    //     where: {
    //       id_product: product.id,
    //       updateAt: {
    //         [Op.between]: [date, end_date ? end_date : date],
    //       },
    //     },
    //   });
    //   // const totalUsedProducts = currentProductOrder.reduce(
    //   //   (acc, el) => acc + el.dataValues.amount_to_use,
    //   //   0
    //   // );
    //   currentProductOrder.description = product.description_product;
    //   product.currentProductOrder = currentProductOrder;
    //   arrInventaryProducts.push(product);
    // }

    data.buysList = currentBuys;

    data.num_products = arrProductAssociatedToOrder.length;
    data.inventary_list = arrProductAssociatedToOrder;

    data.date = date;
    data.end_date = end_date;
    data.ruc = process.env.RUCEMPRESA;

    if (arrProductAssociatedToOrder.length > 0) {
      return {
        msg: 'Cargando vista, por favor espere.',
        success: true,
        data: data,
      };
    } else {
      return {
        msg: 'No hay registros para crear reporte de inventario.',
        success: false,
        data: [],
      };
    }
  } catch (error) {
    console.log('Error al obtener reporte de inventario ->', error);
    return {
      msg: 'Error al obtener reporte de inventario.',
      success: false,
      data: error,
    };
  }
};

const services = { getDialyReports, getInventaryGeneral, getInventaryByDate };

module.exports = services;
