const yup = require('yup');

const createExpenditureSchema = yup.object().shape({
  description_expenditures: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa un nombre válido')
    .required('Nombre es requerido'),
  amount_prod_expenditures: yup
    .number()
    .typeError('La cantidad debe ser numerica')
    .required('Apellido es requerido'),
  total_price: yup
    .number()
    .typeError('El precio debe ser numerico')
    .required('Apellido es requerido'),
  createdAt: yup.date(),
});

const expenditureSchema = { createExpenditureSchema };

module.exports = expenditureSchema;
