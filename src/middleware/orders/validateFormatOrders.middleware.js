const yup = require('yup');
const orderSchemas = require('../../security/schema.validations/createOrder.schema');

const validateDataToOrder = async (req, res, next) => {
  const { body } = req;

  const {
    selectedClient,
    selectedProducts,
    selectedServices,
    selectedEmployees,
    total_to_pay,
    // type_payment,
    stateDefaultAmountToPay,
    promotion,
  } = body;

  try {
    // clients
    const isClientValid = await orderSchemas.clientSchema.isValid(
      selectedClient
    );

    // products
    const schemaArrayOfProducts = yup.array(orderSchemas.objectProductSchema);
    const isProductsValid = await schemaArrayOfProducts.isValid(
      selectedProducts
    );

    // services
    const schemaArrayOfServices = yup.array(orderSchemas.objectServiceSchema);
    const isServicesValid = await schemaArrayOfServices.isValid(
      selectedServices
    );

    // employees
    const schemaArrayOfEmployees = yup.array(
      orderSchemas.objectEmployeesSchema
    );
    const isEmployeesValid = await schemaArrayOfEmployees.isValid(
      selectedEmployees
    );

    const schemaPromotion =
      promotion !== false
        ? await orderSchemas.orderWithPromotionSchema.isValid({
            add_promotion: promotion,
          })
        : true;

    const schematotalToPay = await orderSchemas.totalPay.isValid({
      total_to_pay: total_to_pay,
    });

    // const schemaTypePayment = await orderSchemas.typePaymentSchema.isValid({
    //   type_payment: type_payment,
    // });

    const validateAmountPayments = (objPayment) =>
      Object.values(objPayment).every((item) => item === 0);

    if (
      !isClientValid ||
      !isProductsValid ||
      !isServicesValid ||
      !isEmployeesValid ||
      !schematotalToPay ||
      // !schemaTypePayment ||
      validateAmountPayments(stateDefaultAmountToPay) ||
      !schemaPromotion
    ) {
      return res.json({
        msg: 'Los datos no cumplen con el formato requerido.',
        success: false,
        data: body,
      });
    }
  } catch (error) {
    console.log('error al validar order format ->', error);
  }

  next();

  //   schema.validate({ name: 'jimmy', age: 11 }).catch(function (err) {
  //     console.log('err.name ->', err.name);
  //     console.log('err.errors ->', err.errors);
  //   });
};

module.exports = { validateDataToOrder };
