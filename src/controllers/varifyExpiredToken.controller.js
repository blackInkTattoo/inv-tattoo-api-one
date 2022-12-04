const { getTokenFromRequest } = require('../security/authorization');
const { verifyToken } = require('../security/tokens');

const verifyExpiredToken = async (req, res) => {
  const tokenRequest = await getTokenFromRequest(req);
  const isValidToken = await verifyToken(tokenRequest);
  res.json({
    msg: isValidToken.success ? 'Token valido' : 'Token perdido o invalido',
    success: isValidToken.success,
    data: isValidToken?.data?.name ? isValidToken?.data?.name : '',
  });
};

module.exports = verifyExpiredToken;
