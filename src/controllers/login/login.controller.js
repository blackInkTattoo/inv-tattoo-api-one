const { comparePasswords } = require('../../security/passwords');
const { generateToken } = require('../../security/tokens');
const {
  getUserByEmail,
  buildUserToLogin,
} = require('../../services/users/user.services');

const login = async (req, res) => {
  const { body } = req;
  const user = await getUserByEmail(body.email);
  const validPassword = await comparePasswords(
    body.password,
    user.dataValues.password
  );

  if (!validPassword)
    return res.json({
      msg: 'Error en email o contraseña',
      success: false,
      data: [],
    });

  // generar token y devolver datos pertinentes
  const token = await generateToken(user.dataValues.id);
  const data = await buildUserToLogin(user.dataValues, token);

  res.json({ msg: 'Inicio Exitoso', success: true, data: data });
};

module.exports = { login };
