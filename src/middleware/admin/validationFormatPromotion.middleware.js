const { validateFormat } = require('../validateFormat');
const promotionSchema = require('../../security/schema.validations/promotions.schema');

const validationFormatNewPromotion = async (req, res, next) => {
  const { body } = req;
  const isValid = await validateFormat(body, promotionSchema, res);

  if (!isValid)
    return res.json({
      msg: 'Datos no cumplen con el formato.',
      success: false,
      data: [],
    });

  next();
};

module.exports = { validationFormatNewPromotion };
