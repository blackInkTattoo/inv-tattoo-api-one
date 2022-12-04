const { Op } = require('sequelize');
const ModelProduct = require('../../models/products/product.model');
const { buildHandleError } = require('../../utils/handleErrors');

const saveProduct = async (data) => {
  try {
    const newProduct = new ModelProduct(data);
    let savedProduct = await newProduct.save();

    if (savedProduct)
      return {
        msg: 'Producto guardado exitosamente.',
        success: true,
        data: savedProduct,
      };
  } catch (error) {
    console.log('error al guardar nuevo producto ->', error);
    return { msg: 'Error al crear producto', success: false, data: error };
  }
};

const getProducts = async () => {
  try {
    const products = await ModelProduct.findAll({
      order: [['updatedAt', 'DESC']],
    });

    if (products)
      return {
        msg: 'Productos obtenidos exitosamente.',
        success: true,
        data: products,
      };
  } catch (error) {
    console.log('error al obtener productos ->', error);
    return { msg: 'error al obtener productos', success: false, data: error };
  }
};

const getProductFromDBByName = async (query) => {
  try {
    const matchesProducts = await ModelProduct.findAll({
      where: {
        description_product: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    return {
      msg: 'Lista de productos',
      success: true,
      data: matchesProducts.filter((item) => item.amount_product > 0),
    };
  } catch (error) {
    const msgError = buildHandleError(error.errors);
    console.log('Error al obtener productos ->', msgError);

    return {
      msg: 'Error al obtener productos',
      success: false,
      data: [],
    };
  }
};

const getProductFromDBByID = async (id_product) => {
  try {
    const matchesProducts = await ModelProduct.findOne({
      where: {
        id: id_product,
      },
    });

    return {
      msg: 'Lista de productos',
      success: true,
      data: matchesProducts,
    };
  } catch (error) {
    // const msgError = buildHandleError(error.errors);
    console.log('Error al obtener productos ->', error);

    return {
      msg: 'Error al obtener productos',
      success: false,
      data: [],
    };
  }
};

const deleteProductFromDBByID = async (id) => {
  try {
    const deletedProduct = await ModelProduct.destroy({
      where: {
        id: id,
      },
    });

    if (deletedProduct)
      return {
        msg: 'Producto eliminado exitosamente.',
        success: true,
        data: deletedProduct,
      };
  } catch (error) {
    console.log('error al eliminar producto ->', error);
    return { msg: 'error al eliminar producto', success: false, data: error };
  }
};

const editProductFromDBByID = async (id, data) => {
  try {
    const editedProduct = await ModelProduct.update(data, {
      where: {
        id: id,
      },
    });

    if (editedProduct)
      return {
        msg: 'Producto editado exitosamente.',
        success: true,
        data: editedProduct,
      };
  } catch (error) {
    console.log('error al eliminar producto ->', error);
    return { msg: 'error al eliminar producto', success: false, data: error };
  }
};

const updateAmountProducts = async (id_product, amount) => {
  try {
    // buscamos producto
    const productToUpdate = await getProductFromDBByID(id_product);

    const editedProduct = await ModelProduct.update(
      { amount_product: productToUpdate.data.amount_product + amount },
      {
        where: {
          id: id_product,
        },
      }
    );

    return {
      msg: 'Producto editado exitosamente.',
      success: true,
      data: editedProduct,
    };
  } catch (error) {
    console.log('error al eliminar producto ->', error);
    return { msg: 'error al eliminar producto', success: false, data: error };
  }
};

module.exports = {
  saveProduct,
  getProducts,
  deleteProductFromDBByID,
  editProductFromDBByID,
  getProductFromDBByName,
  updateAmountProducts,
  getProductFromDBByID,
};
