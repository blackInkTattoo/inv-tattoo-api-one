const yup = require('yup');

const createProductSchemaOrServices = yup.object().shape({
  // name_product: yup
  //   .string()
  //   .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
  //   .required('El nombre del producto es requerido'),
  amount_product: yup
    .number('Cantidad de producto debe ser un valor númerico')
    .typeError('Cantidad debe ser númerica')
    // .min(1, 'Minimo debe registrar un producto')
    .required('La cantidad de productos es requerida'),
  // cod_product: yup
  //   .number('Código de producto debe ser un valor númerico')
  //   .min(8, 'Se requiere un código de minimo 8 dígitos')
  //   .required('Se requiere un código de minimo 8 dígitos'),
  description_product: yup
    .string()
    .required('Una descripción es requerida')
    .max(360, 'Descripción no puede ser mayor a 360 caracteres'),
});

module.exports = { createProductSchemaOrServices };
