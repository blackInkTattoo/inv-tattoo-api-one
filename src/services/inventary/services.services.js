const { Op } = require('sequelize');
const ModelService = require('../../models/services/services.model');
const ModelOrdersServices = require('../../models/orders/orsersServices.model');
const { buildHandleError } = require('../../utils/handleErrors');

const saveService = async (data) => {
  try {
    const newServices = new ModelService(data);
    const serviceSaved = await newServices.save();
    if (serviceSaved) {
      return {
        msg: 'Servicio guardado exitosamente',
        success: true,
        data: serviceSaved,
      };
    }

    return {
      msg: 'Imposible guardar el servicio',
      success: true,
      data: serviceSaved,
    };
  } catch (error) {
    console.log('error al guardar servicio', error);
    return {
      msg: 'Error al guardar el servicio',
      success: true,
      data: error,
    };
  }
};

const getAllServicesFromDB = async () => {
  try {
    const servicesList = await ModelService.findAll();
    return {
      msg: 'Lista de servicios',
      success: true,
      data: servicesList,
    };
  } catch (error) {
    console.log('error al obtener lista de servicios ->', error);
    return {
      msg: 'Error al obtener lista de servicios',
      success: false,
      data: error,
    };
  }
};

const getServicesFromDBByName = async (query) => {
  try {
    const matchesServices = await ModelService.findAll({
      where: {
        description_service: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    if (matchesServices) {
      return {
        msg: 'Lista de servicios',
        success: true,
        data: matchesServices,
      };
    }
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener services ->', msgError);

    return {
      msg: 'Error al obtener services',
      success: false,
      data: [],
    };
  }
};

const getServicesByNumontrol = async (num_control) => {
  let resultServices = [];
  try {
    const matchesServices = await ModelOrdersServices.findAll({
      where: {
        num_control,
      },
    });

    for (const serviceOrder of matchesServices) {
      const serviceData = await ModelService.findOne({
        where: { id: serviceOrder.id_service },
      });
      resultServices.push(serviceData);
    }

    return {
      msg: 'Lista de servicios',
      success: true,
      data: resultServices,
    };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener services ->', msgError);

    return {
      msg: 'Error al obtener services',
      success: false,
      data: [],
    };
  }
};

const deleteServicefromDB = async (id) => {
  try {
    const deletedService = await ModelService.destroy({
      where: {
        id: id,
      },
    });

    return {
      msg: 'Servicio eliminado exitosamente.',
      success: true,
      data: deletedService,
    };
  } catch (error) {
    console.log('error al eliminar servicio ->', error);
    return {
      msg: 'Error al eliminar servicios',
      success: false,
      data: error,
    };
  }
};

const editServiceFromDB = async (id, data) => {
  try {
    const editedService = await ModelService.update(data, {
      where: {
        id: id,
      },
    });

    return {
      msg: 'Servicio editado exitosamente.',
      success: true,
      data: editedService,
    };
  } catch (error) {
    console.log('error al editar servicio ->', error);
    return {
      msg: 'Error al editar servicios',
      success: false,
      data: error,
    };
  }
};

module.exports = {
  saveService,
  getAllServicesFromDB,
  getServicesFromDBByName,
  deleteServicefromDB,
  editServiceFromDB,
  getServicesByNumontrol,
};
