const { Op } = require('sequelize');
const ModelExpenditures = require('../../models/expenditures/expenditures.model');

const saveExpenditures = async (data) => {
  try {
    const num_control = await generateNumControlExpenditures();
    data.num_control_expenditures = num_control;

    const newExpenditures = new ModelExpenditures(data);
    const expendituresSaved = await newExpenditures.save();

    return {
      msg: 'Egreso registrado exitosamente.',
      success: true,
      data: expendituresSaved,
    };
  } catch (error) {
    console.log('Error al guaradar egreso.', error);
    return {
      msg: 'Error al guaradar egreso.',
      success: false,
      data: [],
    };
  }
};

const getCurrentExpenditures = async (start_date, end_date) => {
  try {
    const expendituresList = await ModelExpenditures.findAll({
      where: {
        createdAt: {
          [Op.between]: [start_date, end_date ? end_date : start_date],
        },
      },
    });

    return {
      msg: 'Lista de egresos.',
      success: true,
      data: expendituresList,
    };
  } catch (error) {
    console.log('Error al obtener egresos.', error);
    return {
      msg: 'Error al obtener egresos.',
      success: false,
      data: [],
    };
  }
};

const editExpenditures = async (data) => {
  try {
    const expendituresEdited = await ModelExpenditures.update(data, {
      where: {
        id: data.id,
      },
    });

    return {
      msg: 'Egreso editado exitosamente.',
      success: true,
      data: expendituresEdited,
    };
  } catch (error) {
    console.log('Error al editar egreso.', error);
    return {
      msg: 'Error al editar egreso.',
      success: false,
      data: [],
    };
  }
};

const annulateExpeditures = async (id) => {
  try {
    const updatedExpenditures = await ModelExpenditures.update(
      { state_null: true },
      {
        where: {
          id: id,
        },
      }
    );

    return {
      msg: 'Egreso anulado exitosamente.',
      success: true,
      data: updatedExpenditures,
    };
  } catch (error) {
    console.log('Error al anular egreso.', error);
    return {
      msg: 'Error al anular egreso.',
      success: false,
      data: [],
    };
  }
};

const getCountExpenditures = async () => {
  try {
    // const NExpenditures = await ModelExpenditures.count({
    //   attributes: ['id'],
    // });

    const lastIdExpenditures = await ModelExpenditures.findAll({
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return lastIdExpenditures[0]?.dataValues
      ? lastIdExpenditures[0].dataValues.id
      : 0;
  } catch (error) {
    console.log('error al obtener numero de ordenes ->', error);
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const generateNumControlExpenditures = async () => {
  const num_expenditures = await getCountExpenditures();
  const NewNumControl = `NG-${num_expenditures + 1}`;
  return NewNumControl;
};

const getTotalAmountExpenditures = (arr) =>
  arr.reduce((acc, el) => (!el.state_null ? acc + el.total_price : acc), 0);

const expendituresService = {
  saveExpenditures,
  getCurrentExpenditures,
  editExpenditures,
  annulateExpeditures,
  getTotalAmountExpenditures,
};

module.exports = expendituresService;
