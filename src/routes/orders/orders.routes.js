const express = require('express');
const {
  validateToken,
} = require('../../middleware/admin/validation.token.middleware');
const controller = require('../../controllers/orders/orders.controller');
const {
  validateDataToOrder,
} = require('../../middleware/orders/validateFormatOrders.middleware');

const router = express.Router();

// create order
router.post(
  '/create-order',
  validateToken,
  validateDataToOrder,
  controller.createOrder
);

router.get(
  '/get-current-orders',
  validateToken,
  controller.getCurrentOrdersByDB
);

router.put('/annulate-order', validateToken, controller.AnularOrders);

router.get('/get-re-print-order', validateToken, controller.rePrintOrder);

module.exports = router;
