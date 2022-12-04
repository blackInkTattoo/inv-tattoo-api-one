const {
  createClientSchema,
} = require('../../security/schema.validations/createCliehnt.schema');
const { validateFormat } = require('../validateFormat');

const validateFormaNewClient = async (req, res, next) => {
  const { body } = req;
  await validateFormat(body, createClientSchema, res);
  next();
};

module.exports = { validateFormaNewClient };
