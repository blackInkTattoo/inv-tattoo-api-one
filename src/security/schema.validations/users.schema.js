const yup = require('yup');

const userSingInSchema = yup.object().shape({
  // name: yup
  //   .string()
  //   .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre válido')
  //   .required('Nombre es requerido'),
  // last_name: yup
  //   .string()
  //   .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellidos válido')
  //   .required('Apellido es requerido'),
  user_name: yup.string(),
  email: yup
    .string()
    .email('Ingrese un correo electrónico correcto')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(8, 'Una contraseña de, al menos, 8 dígitos es requerido')
    .required('Una contraseña es requerida'),
  role: yup.string(),
});

const userLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingrese un correo electrónico correcto')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(8, 'Una contraseña de, al menos, 8 dígitos es requerido')
    .required('Una contraseña es requerida'),
});

module.exports = {
  userSingInSchema,
  userLoginSchema,
};
