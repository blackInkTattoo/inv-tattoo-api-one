const expendituresService = require('../../services/expenditures/expenditures.service');

const createExpenditures = async (req, res) => {
  const expendituresSaved = await expendituresService.saveExpenditures(
    req.body
  );
  res.json(expendituresSaved);
};

const getCurrentExpenditures = async (req, res) => {
  const { date } = req.query;
  const expendituresList = await expendituresService.getCurrentExpenditures(
    date
  );
  res.json(expendituresList);
};

const editExpenditures = async (req, res) => {
  const expendituresEdited = await expendituresService.editExpenditures(
    req.body
  );
  res.json(expendituresEdited);
};

const annulateExpeditures = async (req, res) => {
  const { id } = req.query;
  const expendituresAnnulated = await expendituresService.annulateExpeditures(
    id
  );
  res.json(expendituresAnnulated);
};

const expendituresController = {
  createExpenditures,
  getCurrentExpenditures,
  editExpenditures,
  annulateExpeditures,
};

module.exports = expendituresController;
