const { Op } = require('sequelize');
const ModelEmployee = require('../../models/employess/employess.model');
const { handleOrders } = require('../../utils/commonFunctions');
const { buildHandleError } = require('../../utils/handleErrors');
const paymentsServices = require('../payments/payments.services');

const saveEmployee = async (data) => {
  try {
    const newEmploye = new ModelEmployee(data);
    const saved = await newEmploye.save();

    if (saved)
      return {
        msg: 'Empleado guardado exitosamente',
        success: true,
        data: saved,
      };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al guardar empleado', msgError);

    return {
      msg: msgError || 'Error al guardar empleado',
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

// const getNameAndLastNameEmployees = async (id_employee) => {
//   try {
//     const employee = await ModelEmployee.findOne({
//       where: {
//         id: id_employee,
//       },
//     });

//     return {
//       msg: 'employee data',
//       success: true,
//       data: employee,
//     };
//   } catch (error) {
//     console.log('error al obtener empleado', error);
//     return {
//       msg: 'error al obtener empledo.',
//       success: false,
//       data: error,
//     };
//   }
// };

const getEmployeeByID = async (id_employee) => {
  try {
    const matchesEmployees = await ModelEmployee.findOne({
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

const deleteOneEmployeeByID = async (id) => {
  try {
    const employeeDeleted = await ModelEmployee.destroy({
      where: {
        id: id,
      },
    });

    return {
      msg: 'Empleado eliminado exitosamente',
      success: true,
      data: [employeeDeleted],
    };
  } catch (error) {
    console.log('Error al eliminar empleados', error);
    return {
      msg: 'Error al eliminar empleados',
      success: false,
      data: error,
    };
  }
};

const editEmployeeById = async (id, data) => {
  try {
    const employeeEdited = await ModelEmployee.update(data, {
      where: {
        id: id,
      },
    });

    if (employeeEdited[0] === 0)
      return {
        msg: 'No se pudo editar el usuario',
        success: false,
        data: data,
      };

    return {
      msg: 'Empleado editado exitosamente',
      success: true,
      data: employeeEdited,
    };
  } catch (error) {
    console.log('Error al editar empleados', error);
    return {
      msg: 'Error al editar empleados',
      success: false,
      data: error,
    };
  }
};

const buildAvancesEmployee = async (
  dataAdvancesEmployees,
  start_date,
  end_date
) => {
  let total_advances = [];
  let data = {};

  for (const employee of dataAdvancesEmployees) {
    const employeeData = await getEmployeeByID(employee.id_employee);

    // const paymentAssociate =
    //   await paymentsServices.getEmployeeAssociateToPaymentByDate(
    //     employee.id_employee,
    //     start_date,
    //     end_date
    //   );

    // console.log('paymentAssociate ->', paymentAssociate.data);

    // const paymentFiltered = await handleOrders.deleteItemsRepitedById(
    //   paymentAssociate.data
    // );

    employee.dataValues.name_employee = employeeData.data.name_employee;
    employee.dataValues.type_employee = employeeData.data.type_employee;

    // data.num_control = paymentAssociate.data.num_pago;
    // data.name_employee = ;
    // data.lastName_employee = employeeData.data.lastName_employee;
    // data.advance = employee.amount_payment;
    // data.date_payment = employee.date_payment;
    // data.type_payment = employee.type_payment;
    total_advances.push(employee);
  }

  return total_advances;
};

const getTotalAdvances = (arr) => {
  const advances = arr.filter((item) => item.type_payment === 'adelanto');
  const result = advances.reduce((acc, el) => acc + el.amount_payment, 0);
  return result;
};

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

// module.exports.getEmployeeByID = getEmployeeByID;
module.exports = {
  saveEmployee,
  getEmployees,
  getEmployeeByName,
  getEmployeeByID,
  deleteOneEmployeeByID,
  editEmployeeById,
  buildAvancesEmployee,
  getTotalAdvances,
  getAllEmployeeHaladores,
};
