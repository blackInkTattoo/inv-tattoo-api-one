const yup = require('yup');

const createBuySchema = yup.object().shape({
  id_utils: yup
    .number()
    .typeError('id del producto debe ser numerico')
    .required(),
  description_buy: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa un nombre válido')
    .required('Nombre es requerido'),
  amount_prod_buy: yup
    .number()
    .typeError('La cantidad debe ser numerica')
    .required('Apellido es requerido'),
  total_price: yup
    .number()
    .typeError('El precio debe ser numerico')
    .required('Apellido es requerido'),
  createdAt: yup.date().required(),
});

const buySchema = { createBuySchema };

module.exports = buySchema;
