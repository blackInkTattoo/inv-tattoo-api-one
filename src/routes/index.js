const express = require('express');
const router = express.Router();
const BASE_URL = process.env.SERVER_BASE_ROUTE;
const user = require('./users/user.routes');
const admin = require('./admin/admin.routes');
const clients = require('./clients/clients.routes');
const verifyExpiredToken = require('./verifyExpiredToken.routes');
const orders = require('./orders/orders.routes');

router.get('/', async (req, res) => res.json('hello word'));
router.use(`${BASE_URL}/verifyToken`, verifyExpiredToken);
router.use(`${BASE_URL}/users`, user);
router.use(`${BASE_URL}/admin`, admin);
router.use(`${BASE_URL}/clients`, clients);
router.use(`${BASE_URL}/orders`, orders);

module.exports = router;
