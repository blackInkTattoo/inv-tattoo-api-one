const ModelUser = require('../../models/users/user.model');
const validatePassword = require('../../security/passwords');
const { buildHandleError } = require('../../utils/handleErrors');

const defaultUser = async () => {
  try {
    const existSuperAdmin = await ModelUser.findOne({
      where: {
        role: 'super-admin',
      },
    });

    if (!existSuperAdmin) {
      const superadmin = {
        name: 'user_name',
        last_name: 'last_name',
        user_name: 'user',
        email: 'correoAdmin@gmail.com',
        role: 'super-admin',
        password: await validatePassword.createHash('passwordd'),
      };

      const newAdmin = new ModelUser(superadmin);
      await newAdmin.save();
    }
    // ------------------------------------------------

    const existAdmin = await ModelUser.findOne({
      where: {
        role: 'admin',
      },
    });

    if (!existAdmin) {
      const admin = {
        name: 'admin_name',
        last_name: 'admin_last_name',
        user_name: 'admin_user',
        email: 'admin@admin.com',
        role: 'admin',
        password: await validatePassword.createHash('password'),
      };

      const newAdmin = new ModelUser(admin);
      await newAdmin.save();
    }
  } catch (error) {
    console.log('error al crear super admin ------------------>', error);
  }
};

const saveUser = async (data) => {
  try {
    const newPassword = await validatePassword.createHash(data.password);
    data.password = newPassword;
    const user = new ModelUser(data);
    const userSaved = await user.save();
    return {
      msg: 'Usuario guardado exitosamente',
      success: true,
      data: buildUserToSingIn(userSaved),
    };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al guardar empleado', msgError);
    return {
      msg: msgError || 'Error al crear usuario.',
      success: false,
      data: error,
    };
  }
};

// const createUser = async (data) => {
//   try {
//     const newPassword = await validatePassword.createHash(data.password);
//     data.password = newPassword;
//     const user = new ModelUser(data);
//     const userSaved = await user.save();
//     return {
//       msg: 'Usuario guardado exitosamente',
//       success: true,
//       data: buildUserToSingIn(userSaved),
//     };
//   } catch (error) {
//     console.log('error to save new user ->', error);
//     return { msg: 'Error al crear usuario.', success: false, data: error };
//   }
// };

const getAllUsers = async () => {
  const usersFormats = [];

  try {
    const users = await ModelUser.findAll();

    if (users) {
      users.forEach((item) => {
        usersFormats.push(buildUserToEdit(item));
      });
    }

    return {
      msg: 'Lista de usuarios',
      success: true,
      data: usersFormats,
    };
  } catch (error) {
    console.log('error al obtener usuarios (services)', error);
    return {
      msg: 'error al obtener usuarios.',
      success: false,
      data: error,
    };
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await ModelUser.findOne({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    return error;
  }
};

const deleteUserByID = async (id) => {
  try {
    const deleteUser = await ModelUser.destroy({
      where: {
        id: id,
      },
    });

    if (deleteUser) {
      return {
        msg: 'Usuario eliminado exitosamente',
        success: true,
        data: deleteUser,
      };
    }
  } catch (error) {
    console.log('error to delete user ->', error);
    return { msg: 'Error al eliminar usuario.', success: false, data: error };
  }
};

const editUserByID = async (id, data) => {
  try {
    const encrypPassword = await validatePassword.createHash(data.password);
    data.password = encrypPassword;

    const userEdited = await ModelUser.update(data, {
      where: {
        id: id,
      },
    });

    if (userEdited[0] === 0)
      return {
        msg: 'No se pudo editar el usuario',
        success: false,
        data: data,
      };

    return {
      msg: 'Usuario editado exitosamente',
      success: true,
      data: userEdited,
    };
  } catch (error) {
    console.log('Error al editar usuario', error);
    return {
      msg: 'Error al editar usuario',
      success: false,
      data: error,
    };
  }
};

const buildUserToSingIn = (data) => {
  const res = {
    name: data.name,
    last_name: data.last_name,
    user_name: data.user_name,
    email: data.email,
    role: data.role,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return res;
};

const buildUserToLogin = (user, token) => {
  const data = {
    user_name: user.user_name,
    email: user.email,
    role: user.role,
    token,
  };
  return data;
};

const buildUserToEdit = (user) => {
  const data = {
    id: user.id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
  };
  return data;
};

module.exports = {
  saveUser,
  getAllUsers,
  getUserByEmail,
  deleteUserByID,
  editUserByID,
  buildUserToSingIn,
  buildUserToLogin,
  defaultUser,
};
