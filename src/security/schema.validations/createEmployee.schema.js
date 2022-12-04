const yup = require('yup');
// require('yup-phone');

const createEmployeeSchema = yup.object().shape({
  name_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
    .required('Nombre es requerido'),
  lastName_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellido válido')
    .required('Apellido es requerido'),
  phone_employee: yup.string().required('Teléfono es requerido'),
  type_employee: yup.string().required('Tipo de empleado es requerido'),
  identification_employee: yup
    .number('Identificación debe ser númerica')
    .min(7, 'Caracteres minimos para la identificación 7')
    .required('La identificación es requerida'),
  // fixed_payment: yup.number(),
  // percent_payment: yup.number(),
});

module.exports = { createEmployeeSchema };
