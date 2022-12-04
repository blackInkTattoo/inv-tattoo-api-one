const express = require('express');
const {
  createNewClient,
  getClientByIdent,
  getClientByLimit,
  getClientsList,
  getClientsListByDate,
} = require('../../controllers/clients/clients.controller');
const {
  validateToken,
} = require('../../middleware/admin/validation.token.middleware');
const {
  validateFormaNewClient,
} = require('../../middleware/clients/validationClient.middleware');

const router = express.Router();

router.post(
  '/create-client',
  validateToken,
  validateFormaNewClient,
  createNewClient
);

router.get('/get-clients-by-ident', validateToken, getClientByIdent);

router.get('/get-clients-by-limit', validateToken, getClientByLimit);

router.get('/get-client-reports', validateToken, getClientsList);

router.get('/get-clients-by-date', validateToken, getClientsListByDate);

module.exports = router;
