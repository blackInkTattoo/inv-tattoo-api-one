const reportsServices = require('../../services/reports/reports.services');

const getDialyCashClosing = async (req, res) => {
  const { date, end_date } = req.query;
  const reportToday = await reportsServices.getDialyReports(date, end_date);
  res.json(reportToday);
};

const controller = { getDialyCashClosing };

module.exports = controller;
