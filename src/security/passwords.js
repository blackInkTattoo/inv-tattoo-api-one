const bcrypt = require('bcrypt');

const saltRounds = bcrypt.genSalt(10);

const createHash = async (password) => {
  const newhash = await bcrypt.hash(String(password), parseInt(saltRounds));
  return newhash;
};

const comparePasswords = async (password, hash) => {
  const comparedPasswords = await bcrypt.compare(password, hash);
  return comparedPasswords;
};

module.exports = { createHash, comparePasswords };
