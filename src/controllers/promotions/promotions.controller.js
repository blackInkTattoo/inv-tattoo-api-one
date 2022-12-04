const servicesPromotions = require('../../services/promotions/promotions.services');

const createPromotionDB = async (req, res) => {
  const { body } = req;
  const promotinSaved = await servicesPromotions.savePromotion(body);
  res.json(promotinSaved);
};

const getAllPromotionsDB = async (req, res) => {
  const listPromotions = await servicesPromotions.getAllPromotions();
  res.json(listPromotions);
};

const getPromotionByState = async (req, res) => {
  const { state } = req.query;
  const promotions = await servicesPromotions.getPromotionsByState(state);
  res.json(promotions);
};

const updatePromotion = async (req, res) => {
  const { id, description_promotion } = req.body;
  const updatePromotion = await servicesPromotions.updatedPromotionById(
    id,
    description_promotion
  );
  res.json(updatePromotion);
};

const deletePromotion = async (req, res) => {
  const { id } = req.query;
  const deletedPromotion = await servicesPromotions.deletePromotionById(id);
  res.json(deletedPromotion);
};

const changeStateOfPromotion = async (req, res) => {
  const { id, state } = req.query;
  const promotionChanged = await servicesPromotions.changeStateOfPromotionDB(
    id,
    state
  );
  res.json(promotionChanged);
};

const controller = {
  createPromotionDB,
  getAllPromotionsDB,
  getPromotionByState,
  updatePromotion,
  changeStateOfPromotion,
  deletePromotion,
};

module.exports = controller;
