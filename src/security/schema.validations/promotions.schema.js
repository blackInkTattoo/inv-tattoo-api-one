const yup = require('yup');

const promotionSchema = yup.object().shape({
  description_promotion: yup
    .string('Descripción debe ser un válida.')
    .matches(/^[a-zA-Zá-üÁ-Ü0-9% ]+$/)
    .typeError('Descripción debe ser texto.')
    .required('Descripción debe ser un válida.'),
  state_promotion: yup
    .boolean()
    .typeError('Estado de la promoción debe ser verdadero o falso.'),
  // .required('Una descripción es requerida.'),
});

module.exports = promotionSchema;
