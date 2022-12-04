const express = require('express');
const {
  createEmployee,
  getAllEmployees,
  deleteOneEmployee,
  editOneEmployee,
  getEmployeesByName,
  getEmployeesByID,
} = require('../../controllers/employess/employess.controller');

const inventaryController = require('../../controllers/inventary/inventary.controller');

const {
  createService,
  getAllServices,
  deleteService,
  editService,
  getServicesByName,
} = require('../../controllers/inventary/services.controller');

const {
  searchProductsServicesAndEmployeesByDescriptions,
  getProductByID,
} = require('../../controllers/search/productsServicesAndEmployees.controller');

const {
  getUsers,
  deleteUser,
  editUser,
} = require('../../controllers/users/user.controller');

const promotionController = require('../../controllers/promotions/promotions.controller');

const {
  validateToken,
} = require('../../middleware/admin/validation.token.middleware');
const {
  validationFormatNewEmployee,
} = require('../../middleware/admin/validationFormatNewEmployee.middleware');

const {
  validateFormNewProductOrService,
} = require('../../middleware/admin/validationFormatsNewProductOrService.middleware');
const {
  validatePermissionSuperAdmin,
} = require('../../middleware/users/validations.user.middleware');

const {
  validationFormatNewPromotion,
} = require('../../middleware/admin/validationFormatPromotion.middleware');
const paymentController = require('../../controllers/payments/payments.controller');

const reportsController = require('../../controllers/reports/reports.controller');
const expendituresController = require('../../controllers/expenditures/expenditures.controller');
const buysController = require('../../controllers/buys/byus.controller');
const expenditureMiddleware = require('../../middleware/admin/validateFormatExpenditure.middleware');
const buyMiddleware = require('../../middleware/admin/validateFormatBuy.middleware');

const router = express.Router();

// products
router.post(
  '/save-product',
  validateToken,
  validateFormNewProductOrService,
  inventaryController.createProduct
);
router.get('/get-products', validateToken, inventaryController.getAllProducts);
router.get('/get-product', validateToken, inventaryController.getProductByName);
router.get('/get-product-by-id', validateToken, getProductByID);
router.delete(
  '/delete-product',
  validateToken,
  inventaryController.deleteProductByID
);
router.put(`/edit-product`, validateToken, inventaryController.editProductById);

// services
router.get('/get-services', validateToken, getAllServices);
router.get('/get-service', validateToken, getServicesByName);
router.post(
  '/create-service',
  validateToken,
  validateFormNewProductOrService,
  createService
);

router.delete('/delete-service', validateToken, deleteService);
router.put('/edit-service', validateToken, editService);

// employess
router.post(
  '/create-employee',
  validateToken,
  validationFormatNewEmployee,
  createEmployee
);
router.get(`/get-employees`, validateToken, getAllEmployees);
router.get('/get-employees-by-name', validateToken, getEmployeesByName);
router.get('/get-employees-by-id', validateToken, getEmployeesByID);
router.delete('/delete-employee', validateToken, deleteOneEmployee);
router.put('/edit-employee', validateToken, editOneEmployee);

// users
// router.post("/create-user", validateToken, )
router.get('/get-users', validateToken, validatePermissionSuperAdmin, getUsers);
router.delete(
  '/delete-user',
  validateToken,
  validatePermissionSuperAdmin,
  deleteUser
);
router.put(
  '/edite-user',
  validateToken,
  validatePermissionSuperAdmin,
  editUser
);

// invenatry
// search producs and services route
router.get(
  '/get-products-or-services',
  validateToken,
  searchProductsServicesAndEmployeesByDescriptions
);

// inventary promotions
router.post(
  '/create-promotion',
  validateToken,
  validationFormatNewPromotion,
  promotionController.createPromotionDB
);

router.put(
  '/update-promotion',
  validateToken,
  promotionController.updatePromotion
);

router.get(
  '/get-promotions',
  validateToken,
  promotionController.getAllPromotionsDB
);

router.get(
  '/get-promotions-by-state',
  validateToken,
  promotionController.getPromotionByState
);

router.put(
  '/change-state-promotion',
  validateToken,
  promotionController.changeStateOfPromotion
);

router.delete(
  '/delete-promotion',
  validateToken,
  promotionController.deletePromotion
);

// employees payments
router.get(
  '/get-debt-by-id-empleado',
  validateToken,
  paymentController.getPendingPaymentEmployeeById
);

router.post(
  '/add-payment-employee',
  validateToken,
  paymentController.registerPaymentEmployee
);

router.get(
  '/get-payments-reports',
  validateToken,
  paymentController.getReportsPayment
);

router.get(
  '/get-payments-paid',
  validateToken,
  paymentController.getReportsPaymentPaid
);

// egresos
router.post(
  '/create-expenditure',
  validateToken,
  expenditureMiddleware.validationFormatNewExpenditure,
  expendituresController.createExpenditures
);

router.get(
  '/get-current-expenditures',
  validateToken,
  expendituresController.getCurrentExpenditures
);

router.put(
  '/update-expenditures',
  validateToken,
  expenditureMiddleware.validationFormatNewExpenditure,
  expendituresController.editExpenditures
);

router.put(
  '/annulate-expenditures',
  validateToken,
  expendituresController.annulateExpeditures
);

// buys
router.post(
  '/create-buy',
  validateToken,
  buyMiddleware.validationFormatNewBuy,
  buysController.createBuy
);

// reportes
router.get(
  '/get-daily-cash-closing',
  validateToken,
  reportsController.getDialyCashClosing
);

router.get(
  '/get-inventary',
  validateToken,
  inventaryController.getInventaryCurrenly
);

router.get(
  '/get-inventary-by-date',
  validateToken,
  inventaryController.getInventaryByDate
);

module.exports = router;
