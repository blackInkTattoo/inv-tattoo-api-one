const {
  saveClient,
  getClientsByIdent,
  getClientsByLimit,
  getClientsReport,
  getClientsByDate,
} = require('../../services/clients/clients.services');

const createNewClient = async (req, res) => {
  const { body } = req;
  const clientSaved = await saveClient(body);

  if (clientSaved) return res.json(clientSaved);

  res.json({
    msg: 'Error al tratar de guardar el nuevo cliente',
    success: false,
    data: employeeSaved.error,
  });
};

const getClientByIdent = async (req, res) => {
  const { ident } = req.query;
  const listClients = await getClientsByIdent(ident);

  if (listClients)
    return res.json({ msg: 'exitoso', success: true, data: listClients });

  res.json({
    msg: 'Error al tratar de obtener los clientes',
    success: false,
    data: listClients.error,
  });
};

const getClientByLimit = async (req, res) => {
  const { offset, limit } = req.query;
  const listClients = await getClientsByLimit(
    offset ? Number(offset) : 0,
    Number(limit)
  );

  if (listClients) return res.json(listClients);

  res.json({
    msg: 'Error al tratar de obtener los clientes por limit',
    success: false,
    data: listClients.error,
  });
};

const getClientsList = async (req, res) => {
  const clients = await getClientsReport();
  res.json(clients);
};

const getClientsListByDate = async (req, res) => {
  const { date, end_date } = req.query;
  const clients = await getClientsByDate(date, end_date);
  res.json(clients);
};

module.exports = {
  createNewClient,
  getClientByIdent,
  getClientByLimit,
  getClientsList,
  getClientsListByDate,
};
