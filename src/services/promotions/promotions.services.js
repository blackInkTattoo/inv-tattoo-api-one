const { Op } = require('sequelize');
const PromotionModel = require('../../models/promotions/promotions.model');

const savePromotion = async (data) => {
  try {
    const newPromotion = new PromotionModel(data);
    const promotionSaved = await newPromotion.save();

    if (promotionSaved)
      return {
        msg: 'Promoción guardada exitosamente.',
        success: true,
        data: promotionSaved,
      };

    return {
      msg: 'Error al registrar promoción.',
      success: false,
      data: [],
    };
  } catch (error) {
    console.log('error al guardar promoción ->', error);
    return {
      msg: 'Error al registrar promoción.',
      success: false,
      data: error,
    };
  }
};

const getAllPromotions = async () => {
  try {
    const listPromotions = await PromotionModel.findAll();

    if (listPromotions)
      return {
        msg: 'Promociones.',
        success: true,
        data: listPromotions,
      };

    return {
      msg: 'Error al obtener promociones.',
      success: false,
      data: [],
    };
  } catch (error) {
    console.log('error al obtener promociones ->', error);
    return {
      msg: 'Error al obtener promociones.',
      success: false,
      data: error,
    };
  }
};

const getPromotionsByState = async (state) => {
  try {
    const listPromotions = await PromotionModel.findAll({
      where: {
        state_promotion: JSON.parse(state),
      },
    });

    if (listPromotions)
      return {
        msg: 'Promociones.',
        success: true,
        data: listPromotions,
      };

    return {
      msg: 'Error al buscar promociones.',
      success: false,
      data: listPromotions,
    };
  } catch (error) {
    console.log('Error al buscar promocines ->', error);
    return {
      msg: 'Error al buscar promociones.',
      success: false,
      data: error,
    };
  }
};

const getPromotionById = async (id) => {
  try {
    const promotion = await PromotionModel.findOne({
      where: {
        id: id,
      },
    });

    if (promotion) return { msg: 'promocion.', success: true, data: promotion };

    return {
      msg: 'Error al obtener promoción.',
      success: false,
      data: [],
    };
  } catch (error) {
    console.log('error al obtener promoción ->', error);
    return {
      msg: 'Error al obtener promoción.',
      success: false,
      data: error,
    };
  }
};

const updatedPromotionById = async (id, data) => {
  try {
    const updatedPromotion = await PromotionModel.update(
      { description_promotion: data },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedPromotion)
      return {
        msg: 'Promoción actualizada exitosamente.',
        success: true,
        data: updatedPromotion,
      };

    return {
      msg: 'Error al actualizar promoción.',
      success: false,
      data: [],
    };
  } catch (error) {
    console.log('error al actualizar promoción ->', error);
    return {
      msg: 'Error al actualizar promoción.',
      success: false,
      data: error,
    };
  }
};

const deletePromotionById = async (id) => {
  try {
    const deletedPromotion = await PromotionModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedPromotion)
      return {
        msg: 'Promoción eliminada exitosamente.',
        success: true,
        data: deletedPromotion,
      };

    return {
      msg: 'Error al eliminar promoción.',
      success: false,
      data: [],
    };
  } catch (error) {
    console.log('error al eliminar promoción ->', error);
    return {
      msg: 'Error al eliminar promoción.',
      success: false,
      data: error,
    };
  }
};

const changeStateOfPromotionDB = async (id, newState) => {
  try {
    await PromotionModel.update(
      { state_promotion: !JSON.parse(newState) },
      {
        where: {
          id: id,
        },
      }
    );

    // await PromotionModel.update(
    //   { state_promotion: false },
    //   {
    //     where: {
    //       id: {
    //         [Op.not]: id,
    //       },
    //     },
    //   }
    // );

    return {
      msg: 'Estado de la promoción actualizada exitosamente.',
      success: true,
      data: [],
    };

    // return {
    //   msg: 'Error al actualizar promociones.',
    //   success: false,
    //   data: [],
    // };
  } catch (error) {
    console.log('error al actualizar promociones ->', error);
    return {
      msg: 'Error al actualizar promociones.',
      success: false,
      data: error,
    };
  }
};

const servicesPromotions = {
  savePromotion,
  updatedPromotionById,
  deletePromotionById,
  getAllPromotions,
  getPromotionById,
  getPromotionsByState,
  changeStateOfPromotionDB,
};

module.exports = servicesPromotions;
