const ModelUser = require('../../models/users/user.model');
const {
  userSingInSchema,
  userLoginSchema,
} = require('../../security/schema.validations/users.schema');
const { validateFormat } = require('../validateFormat');

const validateFormatUserSingIn = async (req, res, next) => {
  const { body } = req;
  const isValid = await validateFormat(body, userSingInSchema, res);
  if (isValid) next();
};

const validateFormatUserLogIn = async (req, res, next) => {
  const { body } = req;
  const isValid = await validateFormat(body, userLoginSchema, res);
  if (isValid) next();
};

const validateRepeatedEmail = async (req, res, next) => {
  try {
    const repeated = await ModelUser.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (repeated?.dataValues?.email) {
      return res.json({
        msg: 'Email o usuario existente',
        success: false,
        data: [],
      });
    }

    next();
  } catch (error) {
    console.log('Error al validar correo repetido ->', error);

    return res
      .status(500)
      .json({ msg: 'Error al validar correo', success: false, data: error });
  }
};

const validateExistEmail = async (req, res, next) => {
  const exist = await ModelUser.findAll({
    where: {
      email: req.body.email,
    },
  });

  if (!exist.length) {
    return res.json({
      msg: 'Error en email o contraseña',
      success: false,
      data: [],
    });
  }

  next();
};

const validatePermissionSuperAdmin = async (req, res, next) => {
  if (req.query.permission !== process.env.SUPER_ADMIN) {
    return res.json({
      msg: 'No tiene los permisos necesarios para continuar.',
      success: false,
      data: [],
    });
  }

  next();
};

module.exports = {
  validatePermissionSuperAdmin,
  validateFormatUserSingIn,
  validateFormatUserLogIn,
  validateRepeatedEmail,
  validateExistEmail,
};
