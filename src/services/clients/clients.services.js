const ModelClient = require('../../models/clients/client.model');
const { buildHandleError } = require('../../utils/handleErrors');
const { Op } = require('sequelize');

const saveClient = async (data) => {
  try {
    const newClient = new ModelClient(data);
    const saved = await newClient.save();

    if (saved)
      return {
        msg: 'Cliente guardado exitosamente',
        success: true,
        data: saved,
      };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al guardar cliente', msgError);

    return {
      msg: msgError || 'Error al guardar cliente',
      success: false,
      data: error,
    };
  }
};

const getClientsByIdent = async (ident) => {
  let matchesClients = [];
  try {
    if (!isNaN(ident)) {
      matchesClients = await ModelClient.findAll({
        where: {
          identification_client: {
            [Op.like]: `%${ident}%`,
          },
        },
      });
    } else {
      matchesClients = await ModelClient.findAll({
        where: {
          name_client: {
            [Op.like]: `%${ident}%`,
          },
        },
      });
    }

    return {
      msg: 'Lista de clientes',
      success: true,
      data: matchesClients,
    };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener clientes', msgError);

    return {
      msg: msgError || 'Error al obtener clientes',
      success: false,
      data: error,
    };
  }
};

const getClientsByLimit = async (offset, limit) => {
  try {
    const clientsLimit = await ModelClient.findAll({ offset, limit });

    if (clientsLimit)
      return { msg: 'Primeros 10 clients', success: true, data: clientsLimit };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener clientes por limit', msgError);

    return {
      msg: msgError || 'Error al obtener clientes por limit',
      success: false,
      data: error,
    };
  }
};

const getClientByID = async (id_client) => {
  try {
    const clientsLimit = await ModelClient.findOne({
      where: { id: id_client },
    });

    return {
      msg: 'Datos del cliente',
      success: true,
      data: clientsLimit,
    };
  } catch (error) {
    // const msgError = buildHandleError(error.errors);
    console.log('Error al obtener cliente', error);

    return {
      msg: 'Error al obtener cliente',
      success: false,
      data: {},
    };
  }
};

const getClientsReport = async () => {
  let data = {};
  try {
    const clientList = await ModelClient.findAll();
    data.ruc = process.env.RUCEMPRESA;
    data.clients = clientList;
    data.num_clients = clientList.length;
    return {
      msg: 'lista de clientes',
      success: true,
      data: data,
    };
  } catch (error) {
    console.log('Error al obtener clientes', error);

    return {
      msg: 'Error al obtener clientes',
      success: false,
      data: [],
    };
  }
};

const getClientsByDate = async (date, end_date) => {
  let data = {};
  try {
    const clientList = await ModelClient.findAll({
      where: {
        updatedAt: {
          [Op.between]: [
            `${date} 00:00:00`,
            end_date ? `${end_date} 00:00:00` : `${date} 00:00:00`,
          ],
        },
      },
    });

    data.ruc = process.env.RUCEMPRESA;
    data.clients = clientList;
    data.num_clients = clientList.length;
    data.date = date;
    data.end_date = end_date;

    return {
      msg: 'lista de clientes',
      success: true,
      data: data,
    };
  } catch (error) {
    console.log('Error al obtener lista de clientes', error);

    return {
      msg: 'Error al obtener lista de clientes',
      success: false,
      data: [],
    };
  }
};

module.exports = {
  saveClient,
  getClientsByIdent,
  getClientsByLimit,
  getClientByID,
  getClientsReport,
  getClientsByDate,
};
