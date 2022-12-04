const yup = require('yup');

// clients
const objectClient = yup.object().shape({
  id: yup.number().integer().min(1).required(),
  identification_client: yup.number().min(7).required(),
  lastName_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellido válido')
    .required('Apellido es requerido'),
  name_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
    .required('Nomrbe es requerido'),
  phone_client: yup.string(),
});

// products
const objectProducts = yup.object().shape({
  id: yup.number().integer().min(1).required(),
  amount_product: yup.number().integer().min(1).required(),
  amount_to_use: yup.number().integer().min(1).required(),
  // cod_product: null
  description_product: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa una descripción válida')
    .required('Descripción es requerido'),
});

// services
const objectServices = yup.object().shape({
  id: yup.number().integer().min(1).required('id requerido'),
  amount_service: yup.number().min(1).required('cantidad requerida'),
  // cod_service: null
  description_service: yup
    .string('descricion debe ser string')
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa una descripción válida')
    .required('Descripción es requerido'),
});

// employees
const objectEmployees = yup.object().shape({
  id: yup.number().integer().min(1).required(),
  fixed_payment: yup.number(),
  identification_employee: yup.number().min(7).required(),
  lastName_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellido válido')
    .required('Apellido es requerido'),
  name_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
    .required('Nombre es requerido'),
  percent_payment: yup.number().integer(),
  phone_employee: yup.string(),
  type_employee: yup.string().required(),
});

// promotions
const orderWithPromotion = yup.object().shape({
  add_promotion: yup.number().integer().min(1).required(),
});

// total to pay
const totalToPay = yup.object().shape({
  total_to_pay: yup
    .number('el total debe ser númerico')
    .min(1, 'Total a pagar debe ser mayor a 0')
    .required('Total a pagar es requerido'),
});

const typeToPayment = yup.object().shape({
  type_payment: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un tipo de pago válido')
    .required('Tipo de pago es requerido'),
});

const orderValidactionsSchemas = {
  clientSchema: objectClient,
  objectProductSchema: objectProducts,
  objectServiceSchema: objectServices,
  objectEmployeesSchema: objectEmployees,
  totalPay: totalToPay,
  typePaymentSchema: typeToPayment,
  orderWithPromotionSchema: orderWithPromotion,
};

module.exports = orderValidactionsSchemas;
