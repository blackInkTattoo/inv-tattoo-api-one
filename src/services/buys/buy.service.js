const { Op } = require('sequelize');
const ModelBuy = require('../../models/buys/buys.model');
const expendituresService = require('../expenditures/expenditures.service');
const { updateAmountProducts } = require('../inventary/inventary.services');

const saveBuy = async (data) => {
  try {
    const num_control = await generateNumControlBuys();
    data.num_control_buy = num_control;

    // guardamos la compra
    const newBuy = new ModelBuy(data);
    const buySaved = await newBuy.save();

    // sumar cantidad en el producto.
    const updatedProduct = await updateAmountProducts(
      data.id_utils,
      data.amount_prod_buy
    );

    if (!updatedProduct.success) {
      return {
        msg: 'Error al actualizar cantidad de prodcuto.',
        success: false,
        data: [],
      };
    }

    // guardamos en tabla de gastos
    // const formatExpenditure = {
    //   description_expenditures: data.description_buy,
    //   amount_prod_expenditures: data.amount_prod_buy,
    //   total_price: data.total_price,
    //   createdAt: data.createdAt,
    // };

    // const expenditureSaved = await expendituresService.saveExpenditures(
    //   formatExpenditure
    // );

    // if (!expenditureSaved.success) {
    //   return {
    //     msg: 'Error al guardar compra en gastos.',
    //     success: false,
    //     data: [],
    //   };
    // }

    return {
      msg: 'Compra registrado exitosamente.',
      success: true,
      data: buySaved,
    };
  } catch (error) {
    console.log('Error al guaradar compra.', error);
    return {
      msg: 'Error al guaradar compra.',
      success: false,
      data: [],
    };
  }
};

const getCountBuys = async () => {
  try {
    // const NBuys = await ModelBuy.count({
    //   attributes: ['id'],
    // });

    const lastIdBuys = await ModelBuy.findAll({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return lastIdBuys[0]?.dataValues ? lastIdBuys[0]?.dataValues?.id : 0;
  } catch (error) {
    console.log('error al obtener numero de ordenes ->', error);
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const generateNumControlBuys = async () => {
  const num_buys = await getCountBuys();
  const NewNumControl = `NC-${num_buys + 1}`;
  console.log('NewNumControl ->', NewNumControl);
  return NewNumControl;
};

const getCurrentBuys = async (start_date, end_date) => {
  try {
    const buysList = await ModelBuy.findAll({
      where: {
        createdAt: {
          [Op.between]: [start_date, end_date ? end_date : start_date],
        },
      },
    });

    return {
      msg: 'Lista de compras.',
      success: true,
      data: buysList,
    };
  } catch (error) {
    console.log('Error al buscar compras.', error);
    return {
      msg: 'Error al buscar compras.',
      success: false,
      data: [],
    };
  }
};

const getTotalAmountBuys = (arr) =>
  arr.reduce((acc, el) => acc + el.total_price, 0);

const buyService = {
  saveBuy,
  getCurrentBuys,
  getTotalAmountBuys,
};

module.exports = buyService;
