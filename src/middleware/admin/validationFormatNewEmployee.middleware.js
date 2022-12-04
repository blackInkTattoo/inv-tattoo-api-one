const { validateFormat } = require('../validateFormat');
const {
  createEmployeeSchema,
} = require('../../security/schema.validations/createEmployee.schema');

const validationFormatNewEmployee = async (req, res, next) => {
  const { body } = req;
  await validateFormat(body, createEmployeeSchema, res);
  next();
};

module.exports = { validationFormatNewEmployee };
