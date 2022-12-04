const jwt = require('jsonwebtoken');

const generateToken = async (data) => {
  const token = await jwt.sign({ id: data }, process.env.SECRET_TOKEN, {
    expiresIn: '24h',
  });

  return token;
};

const verifyToken = async (decodeToken) => {
  try {
    const token = await jwt.verify(decodeToken, process.env.SECRET_TOKEN);

    if (!token.id) return { success: null };

    return { data: token, success: true };
  } catch (error) {
    return { data: error, success: null };
  }
};

const refreshToken = async () => {};

module.exports = { generateToken, verifyToken };
