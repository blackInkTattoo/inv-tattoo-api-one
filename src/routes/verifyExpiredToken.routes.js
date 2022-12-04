const express = require('express');
const verifyExpiredToken = require('../controllers/varifyExpiredToken.controller');
const router = express.Router();

router.post('/', verifyExpiredToken);

module.exports = router;
