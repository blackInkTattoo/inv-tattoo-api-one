const buyService = require('../../services/buys/buy.service');

const createBuy = async (req, res) => {
  const buySaved = await buyService.saveBuy(req.body);
  res.json(buySaved);
};

const buysController = { createBuy };

module.exports = buysController;
