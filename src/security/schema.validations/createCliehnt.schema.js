const yup = require('yup');
// require('yup-phone');

const createClientSchema = yup.object().shape({
  name_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
    .required('Nombre es requerido'),
  lastName_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellido válido')
    .required('Apellido es requerido'),
  identification_client: yup
    .number('Identificación debe ser númerica')
    .min(7, 'Caracteres minimos para la identificación 7')
    .required('La identificación es requerida'),
  phone_client: yup.string().required('Teléfono es requerido'),
});

module.exports = { createClientSchema };
