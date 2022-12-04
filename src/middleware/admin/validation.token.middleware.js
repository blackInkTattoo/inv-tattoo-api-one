const { getTokenFromRequest } = require('../../security/authorization');
const { verifyToken } = require('../../security/tokens');
const { handleErrorVerificateToken } = require('../../utils/handleErrors');

const validateToken = async (req, res, next) => {
  try {
    const tokenRequest = await getTokenFromRequest(req);

    if (!tokenRequest) {
      return res.json({
        msg: 'No tienes los permisos necesarios.',
        success: false,
        data: [],
      });
    }

    const isValidToken = await verifyToken(tokenRequest);

    if (!isValidToken.success) {
      return res.json({
        msg: 'Token perdido o invalido',
        success: false,
        data: isValidToken.data.name,
      });
    }

    next();
  } catch (error) {
    console.log('Error al verificar token', error);
    const dataError = handleErrorVerificateToken(error);
    res.json(dataError);
  }
};

module.exports = { validateToken };
