const { validateFormat } = require('../validateFormat');
const expenditureSchema = require('../../security/schema.validations/createExpenditure.schema');

const validationFormatNewExpenditure = async (req, res, next) => {
  const { body } = req;
  const isValid = await validateFormat(
    body,
    expenditureSchema.createExpenditureSchema
  );
  if (!isValid)
    return res.json({
      msg: 'Datos no cumplen con el formato valido',
      success: false,
      data: [],
    });
  next();
};

const expenditureMiddleware = { validationFormatNewExpenditure };

module.exports = expenditureMiddleware;
