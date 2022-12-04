const express = require('express');
const router = express.Router();
const { createUser } = require('../../controllers/users/user.controller');
const { login } = require('../../controllers/login/login.controller');
const {
  validateFormatUserSingIn,
  validateFormatUserLogIn,
  validateRepeatedEmail,
  validateExistEmail,
} = require('../../middleware/users/validations.user.middleware');

router.post(
  `/create-user`,
  validateFormatUserSingIn,
  validateRepeatedEmail,
  createUser
);

router.post(`/login`, validateFormatUserLogIn, validateExistEmail, login);

module.exports = router;
