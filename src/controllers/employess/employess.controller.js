const {
  saveEmployee,
  getEmployees,
  deleteOneEmployeeByID,
  editEmployeeById,
  getEmployeeByName,
  getEmployeeByID,
} = require('../../services/employess/employees.services');

const createEmployee = async (req, res) => {
  const { body } = req;

  const employeeSaved = await saveEmployee(body);

  if (employeeSaved) return res.json(employeeSaved);

  res.json({
    msg: 'Error al tratar de guardar el nuevo emleado',
    success: false,
    data: employeeSaved.error,
  });
};

const getAllEmployees = async (req, res) => {
  // const {body} = req
  const listEmployees = await getEmployees();
  res.json(listEmployees);
};

const getEmployeesByName = async (req, res) => {
  const { name } = req.query;

  const employessList = await getEmployeeByName(name);

  if (employessList) return res.json(employessList);

  res.json({
    msg: 'Error al tratar de obtener los empleados',
    success: false,
    data: employessList.error,
  });
};

const getEmployeesByID = async (req, res) => {
  const { id_employee } = req.query;
  const employessList = await getEmployeeByID(id_employee);
  res.json(employessList);
};

const deleteOneEmployee = async (req, res) => {
  const { id } = req.query;

  const employeeDeleted = await deleteOneEmployeeByID(id);

  if (employeeDeleted) return res.json(employeeDeleted);

  res.json({
    msg: 'Error al tratar de eliminar empleado',
    success: false,
    data: employeeDeleted.error,
  });
};

const editOneEmployee = async (req, res) => {
  const { id } = req.query;
  const { body } = req;

  const employeeEdited = await editEmployeeById(id, body);

  if (employeeEdited) return res.json(employeeEdited);

  res.json({
    msg: 'Error al tratar de editar empleado',
    success: false,
    data: employeeEdited.error,
  });
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeesByName,
  getEmployeesByID,
  deleteOneEmployee,
  editOneEmployee,
};
