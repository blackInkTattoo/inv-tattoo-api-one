const buildHandleError = (arrayErrors) => {
  const [ValidationErrorItem] = arrayErrors;
  const { message } = ValidationErrorItem;

  switch (message) {
    case 'identification_employee must be unique':
      return 'Identificacion debe ser único.';

    case 'user_name must be unique':
      return 'Nombre de usuario debe ser único.';

    default:
      return '';
  }
};

const handleErrorVerificateToken = (error) => {
  switch (error.message) {
    case 'jwt expired':
      return {
        msg: 'Token Expirado, por favor inicie sesión nuevamente para obtener un token válido',
        success: false,
        data: [],
      };

    default:
      return '';
  }
};

module.exports = { buildHandleError, handleErrorVerificateToken };
