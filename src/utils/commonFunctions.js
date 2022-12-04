const ModelOrders = require('../models/orders/orders.model');
const {
  getEmployeeAssociateToOrderByNumControl,
  getServicesAssociateToOrder,
} = require('../services/orders/searchProductsServicesAndEmployees.services');
const paymentsServices = require('../services/payments/payments.services');

// commonFunctions
const getCountOrders = async () => {
  try {
    const lastIdOrder = await ModelOrders.findAll({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    // const NOrders = await ModelOrders.count({
    //   attributes: ['id'],
    // });

    return lastIdOrder[0]?.dataValues ? lastIdOrder[0].dataValues.id : 0;
  } catch (error) {
    console.log('error al obtener numero de ordenes ->', error);
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const generateNewNumberControl = async () => {
  const num_orders = await getCountOrders();
  const NewNumControl = `NO-${num_orders + 1}`;
  return NewNumControl;
};

const generateNewNumberControlPayment = async () => {
  const { data } = await paymentsServices.getNumsPayments();
  const newCodPaymentControl = `NP-${data + 1}`;
  return newCodPaymentControl;
};

const replaceIDWhereObj = (arrObjs, fieldToSearch, fieldToReplace) => {
  let newArr = [];
  arrObjs.forEach((item) => {
    item[fieldToSearch] = item[fieldToReplace];
    delete item[fieldToReplace];
    newArr.push(item);
  });

  return newArr;
};

const getActualDate = () => new Date(Date.now()).toISOString().split('T')[0];

const addDaysToDate = (date = null, days = 1) => {
  let d = new Date();

  if (date) {
    d = new Date(date);
  }

  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const getPercentToPayment = (total, percent) => (total * percent) / 100;

const calculatePaymentTotal = (employeeData, advance, total) => {
  let payment = 0;

  if (total === 0) {
    return total;
  }

  if (
    employeeData?.percent_payment !== 0 ||
    employeeData?.percent_payment !== ''
  ) {
    payment = getPercentToPayment(total, employeeData.percent_payment);
  }

  const withAdvance = advance > 0 ? payment - advance : payment;
  const result = employeeData?.fixed_payment
    ? withAdvance + employeeData?.fixed_payment
    : withAdvance;

  return result;
};

const addAmountsOfObjects = (arr, field) =>
  arr.reduce((acc, el) => acc + el[field], 0);

const addObject = (obj) => {
  return Object.values(obj).reduce((acc, el) => {
    return acc + el;
  }, 0);
};

const getTotalofOrdersByTypePayment = async (data) => {
  // buscamos los empleados asociados a la ordem
  let result = [];

  // buscamos cada uno de los trabajadores asociados a la orden
  for (const orden of data) {
    let data = {};

    const employeeByOrder = await getEmployeeAssociateToOrderByNumControl(
      orden.num_control
    );

    data = { ...orden.dataValues };
    data.employees = employeeByOrder.data;

    result.push(data);
  }

  // buscamos los servicios pretados asociados a la orden
  for (const order of result) {
    const servicesByOrder = await getServicesAssociateToOrder(
      order.num_control
    );
    order.services = servicesByOrder.data;
  }

  return result;

  // const result = data.reduce((acc, el) => {
  //   if (el.type_payment === 'tarjeta') {
  //     acc.total_visa = acc?.total_visa
  //       ? [
  //           ...acc.total_visa,
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ]
  //       : [
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ];
  //   } else if (el.type_payment === 'efectivo') {
  //     acc.total_cash = acc?.total_cash
  //       ? [
  //           ...acc.total_cash,
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             vuelto: el.vuelto,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ]
  //       : [
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             vuelto: el.vuelto,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ];
  //   } else if (el.type_payment === 'yape') {
  //     acc.total_yape = acc?.total_yape
  //       ? [
  //           ...acc.total_yape,
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ]
  //       : [
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ];
  //   } else if (el.type_payment === 'plin') {
  //     acc.plin = acc?.plin
  //       ? [
  //           ...acc.plin,
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ]
  //       : [
  //           {
  //             num_control: el.num_control,
  //             type: el.type_payment,
  //             total: el.payment_total,
  //             state_null: el.state_null,
  //             employees: employees,
  //             services: services,
  //           },
  //         ];
  //   } else {
  //     return {};
  //   }
  //   return acc;
  // }, {});
};

const deleteItemsRepitedById = (arr) => {
  const result = arr.reduce((acc, el) => {
    if (!acc.some((item) => item.id === el.id)) {
      acc.push(el);
    }
    return acc;
  }, []);

  return result;
};

const calculateTotalsByTypePayment = (arr) => {
  const result = arr.reduce((acc, el) => {
    if (!el.state_null) {
      acc.cash = acc?.cash
        ? acc.cash + (el.cash - el.vuelto)
        : el.cash - el.vuelto;
      acc.card = acc?.card ? acc.card + el.card : el.card;
      acc.plin = acc?.plin ? acc.plin + el.plin : el.plin;
      acc.yape = acc?.yape ? acc.yape + el.yape : el.yape;
    }
    return acc;
  }, {});

  return result;

  // const data = {};
  // if (obj.total_cash) {
  //   const res = obj.total_cash.reduce((acc, el) => {
  //     if (!el.state_null) {
  //       acc.total_cash = acc?.total_cash
  //         ? acc?.total_cash + el.total
  //         : el.total;
  //     }

  //     return acc;
  //   }, {});
  //   data.total_cash = res?.total_cash > 0 ? res?.total_cash : 0;
  // }

  // if (obj.plin) {
  //   const res = obj.plin.reduce((acc, el) => {
  //     if (!el.state_null) {
  //       acc.total_plin = acc?.total_plin
  //         ? acc?.total_plin + el.total
  //         : el.total;
  //     }

  //     return acc;
  //   }, {});
  //   data.total_plin = res?.total_plin > 0 ? res?.total_plin : 0;
  // }

  // if (obj.total_visa) {
  //   const res = obj.total_visa.reduce((acc, el) => {
  //     if (!el.state_null) {
  //       acc.total_visa = acc?.total_visa
  //         ? acc?.total_visa + el.total
  //         : el.total;
  //     }

  //     return acc;
  //   }, {});
  //   data.total_visa = res?.total_visa > 0 ? res?.total_visa : 0;
  // }

  // if (obj.total_yape) {
  //   const res = obj.total_yape.reduce((acc, el) => {
  //     if (!el.state_null) {
  //       acc.total_yape = acc?.total_yape
  //         ? acc?.total_yape + el.total
  //         : el.total;
  //     }

  //     return acc;
  //   }, {});
  //   data.total_yape = res?.total_yape > 0 ? res?.total_yape : 0;
  // }
  // return data;
};

const restAdvancesAndExpenditures = (
  cash,
  adnavces,
  expend,
  toal_payments_c_haladores
) => {
  let total = 0;

  if (adnavces > 0 || expend > 0 || toal_payments_c_haladores > 0) {
    total = cash - adnavces - expend - toal_payments_c_haladores;
  } else {
    total = cash;
  }

  return total;
};

const converterNumsToLetters = (cifra) => {
  const numeroALetras = (() => {
    // Código basado en el comentario de @sapienman
    // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
    function Unidades(num) {
      switch (num) {
        case 1:
          return 'UN';
        case 2:
          return 'DOS';
        case 3:
          return 'TRES';
        case 4:
          return 'CUATRO';
        case 5:
          return 'CINCO';
        case 6:
          return 'SEIS';
        case 7:
          return 'SIETE';
        case 8:
          return 'OCHO';
        case 9:
          return 'NUEVE';
      }

      return '';
    } //Unidades()

    function Decenas(num) {
      let decena = Math.floor(num / 10);
      let unidad = num - decena * 10;

      switch (decena) {
        case 1:
          switch (unidad) {
            case 0:
              return 'DIEZ';
            case 1:
              return 'ONCE';
            case 2:
              return 'DOCE';
            case 3:
              return 'TRECE';
            case 4:
              return 'CATORCE';
            case 5:
              return 'QUINCE';
            default:
              return 'DIECI' + Unidades(unidad);
          }
        case 2:
          switch (unidad) {
            case 0:
              return 'VEINTE';
            default:
              return 'VEINTI' + Unidades(unidad);
          }
        case 3:
          return DecenasY('TREINTA', unidad);
        case 4:
          return DecenasY('CUARENTA', unidad);
        case 5:
          return DecenasY('CINCUENTA', unidad);
        case 6:
          return DecenasY('SESENTA', unidad);
        case 7:
          return DecenasY('SETENTA', unidad);
        case 8:
          return DecenasY('OCHENTA', unidad);
        case 9:
          return DecenasY('NOVENTA', unidad);
        case 0:
          return Unidades(unidad);
      }
    } //Unidades()

    function DecenasY(strSin, numUnidades) {
      if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);

      return strSin;
    } //DecenasY()

    function Centenas(num) {
      let centenas = Math.floor(num / 100);
      let decenas = num - centenas * 100;

      switch (centenas) {
        case 1:
          if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
          return 'CIEN';
        case 2:
          return 'DOSCIENTOS ' + Decenas(decenas);
        case 3:
          return 'TRESCIENTOS ' + Decenas(decenas);
        case 4:
          return 'CUATROCIENTOS ' + Decenas(decenas);
        case 5:
          return 'QUINIENTOS ' + Decenas(decenas);
        case 6:
          return 'SEISCIENTOS ' + Decenas(decenas);
        case 7:
          return 'SETECIENTOS ' + Decenas(decenas);
        case 8:
          return 'OCHOCIENTOS ' + Decenas(decenas);
        case 9:
          return 'NOVECIENTOS ' + Decenas(decenas);
      }

      return Decenas(decenas);
    } //Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
      let cientos = Math.floor(num / divisor);
      let resto = num - cientos * divisor;

      let letras = '';

      if (cientos > 0)
        if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
        else letras = strSingular;

      if (resto > 0) letras += '';

      return letras;
    } //Seccion()

    function Miles(num) {
      let divisor = 1000;
      let cientos = Math.floor(num / divisor);
      let resto = num - cientos * divisor;

      let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
      let strCentenas = Centenas(resto);

      if (strMiles == '') return strCentenas;

      return strMiles + ' ' + strCentenas;
    } //Miles()

    function Millones(num) {
      let divisor = 1000000;
      let cientos = Math.floor(num / divisor);
      let resto = num - cientos * divisor;

      let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
      let strMiles = Miles(resto);

      if (strMillones == '') return strMiles;

      return strMillones + ' ' + strMiles;
    } //Millones()

    return function NumeroALetras(num, currency) {
      currency = currency || {};
      let data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: Math.round(num * 100) - Math.floor(num) * 100,
        letrasCentavos: '',
        letrasMonedaPlural: currency.plural || 'PESOS CHILENOS', //'PESOS', 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: currency.singular || 'PESO CHILENO', //'PESO', 'Dólar', 'Bolivar', 'etc'
        letrasMonedaCentavoPlural:
          currency.centPlural || 'CHIQUI PESOS CHILENOS',
        letrasMonedaCentavoSingular:
          currency.centSingular || 'CHIQUI PESO CHILENO',
      };

      if (data.centavos > 0) {
        data.letrasCentavos =
          'CON ' +
          (function () {
            if (data.centavos == 1)
              return (
                Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular
              );
            else
              return (
                Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural
              );
          })();
      }

      if (data.enteros == 0)
        return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      if (data.enteros == 1)
        return (
          Millones(data.enteros) +
          ' ' +
          data.letrasMonedaSingular +
          ' ' +
          data.letrasCentavos
        );
      else
        return (
          Millones(data.enteros) +
          ' ' +
          data.letrasMonedaPlural +
          ' ' +
          data.letrasCentavos
        );
    };
  })();

  return numeroALetras(cifra, {
    plural: 'SOLES',
    singular: 'SOL',
    centPlural: 'CENTAVOS',
    centSingular: 'CENTAVO',
  });
};

module.exports.handleOrders = {
  getCountOrders,
  generateNewNumberControl,
  replaceIDWhereObj,
  getActualDate,
  addDaysToDate,
  addAmountsOfObjects,
  addObject,
  getPercentToPayment,
  calculatePaymentTotal,
  getTotalofOrdersByTypePayment,
  calculateTotalsByTypePayment,
  deleteItemsRepitedById,
  generateNewNumberControlPayment,
  restAdvancesAndExpenditures,
  converterNumsToLetters,
};
