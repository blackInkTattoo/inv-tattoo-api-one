const { connectionDB } = require('../../../database/connection');
const ModelUser = require('../../models/users/user.model');
const {
  saveUser,
  getAllUsers,
  deleteUserByID,
  editUserByID,
} = require('../../services/users/user.services');

const createUser = async (req, res) => {
  const { body } = req;
  try {
    const saved = await saveUser(body);

    if (saved) return res.json(saved);

    res.status(500).json({
      msg: 'error desconocido al crear usuario',
      success: false,
      data: saved,
    });
  } catch (error) {
    console.log('error to create user ->', error);
    res.json({
      msg: 'error al crear nuevo usuario',
      success: false,
      data: error,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const userList = await getAllUsers();

    if (userList) return res.json(userList);

    res.status(500).json({
      msg: 'error desconocido al obtener usuarios',
      success: false,
      data: userList,
    });
  } catch (error) {
    console.log('error desconocido al obtener usuarios.', error);
    res.status(500).json({
      msg: 'error desconocido al obtener usuarios.',
      success: false,
      data: error,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.query;

  try {
    const deleted = await deleteUserByID(id);

    if (deleted) return res.json(deleted);

    res.status(500).json({
      msg: 'error desconocido al eliminar usuario',
      success: false,
      data: deleted,
    });
  } catch (error) {
    console.log('error desconocido al eliminar usuario.', error);
    res.status(500).json({
      msg: 'error desconocido al eliminar usuario.',
      success: false,
      data: error,
    });
  }
};

const editUser = async (req, res) => {
  const { id } = req.query;
  const { body } = req;

  try {
    const edited = await editUserByID(id, body);

    if (edited) return res.json(edited);

    res.status(500).json({
      msg: 'error desconocido al editar usuario',
      success: false,
      data: edited,
    });
  } catch (error) {
    console.log('error desconocido al editar usuario.', error);
    res.status(500).json({
      msg: 'error desconocido al editar usuario.',
      success: false,
      data: error,
    });
  }

  res.json({ msg: 'ex', data: body, id: id });
};

module.exports = { createUser, getUsers, deleteUser, editUser };
