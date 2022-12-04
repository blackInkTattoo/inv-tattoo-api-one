const {
  createProductSchemaOrServices,
} = require('../../security/schema.validations/createProductOrService.schema');
const { validateFormat } = require('../validateFormat');

const validateFormNewProductOrService = async (req, res, next) => {
  const { body } = req;

  const idValidData = await validateFormat(body, createProductSchemaOrServices);

  if (!idValidData)
    return res.json({
      msg: 'Datos no cumplen con el formato correcto. Imposible continuar.',
      success: false,
      data: [body, idValidData],
    });

  next();
};

module.exports = { validateFormNewProductOrService };
