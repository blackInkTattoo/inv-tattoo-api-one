const { validateFormat } = require('../validateFormat');
const buySchema = require('../../security/schema.validations/createBuy.schema');

const validationFormatNewBuy = async (req, res, next) => {
  const { body } = req;
  const isValid = await validateFormat(body, buySchema.createBuySchema);

  if (!isValid)
    return res.json({
      msg: 'Datos no cumplen con el formato valido',
      success: false,
      data: [],
    });

  next();
};

const buyMiddleware = { validationFormatNewBuy };

module.exports = buyMiddleware;
