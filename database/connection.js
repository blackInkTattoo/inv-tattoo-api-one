const { Sequelize } = require('sequelize');

const getTypeConnecion = () => {
  const connection = process.env.TYPE_CONNECTION;
  if (connection === 'LOCAL') {
    return new Sequelize(
      process.env.LOCAL_DB,
      process.env.LOCAL_USER_DB,
      process.env.LOCAL_PASSWORD_DB,
      {
        host: process.env.LOCAL_HOSTNAME_DB,
        dialect: 'mysql',
        // logging: false
      }
    );
  }

  if (connection === 'REMOTE') {
    return new Sequelize(
      process.env.REMOTE_DB,
      process.env.REMOTE_USER_DB,
      process.env.REMOTE_PASSWORD_DB,
      {
        host: process.env.REMOTE_HOSTNAME_DB,
        dialect: 'mysql',
      }
    );
  }
};

const sequelize =
  process.env.TYPE_CONNECTION === 'LOCAL'
    ? new Sequelize(
        process.env.LOCAL_DB,
        process.env.LOCAL_USER_DB,
        process.env.LOCAL_PASSWORD_DB,
        {
          host: process.env.LOCAL_HOSTNAME_DB,
          dialect: 'mysql',
          // logging: false
        }
      )
    : new Sequelize(
        process.env.REMOTE_DB,
        process.env.REMOTE_USER_DB,
        process.env.REMOTE_PASSWORD_DB,
        {
          dialect: 'mysql',
          host: process.env.REMOTE_HOSTNAME_DB,
          port: process.env.REMOTE_PORT_DB,
          protocol: null,
          //logging: true,
          // Configuración del grupo de conexiones
          pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
          },
        }
      );

const connect = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: false });

    console.log(
      `db ${
        process.env.TYPE_CONNECTION === 'LOCAL'
          ? process.env.LOCAL_DB
          : process.env.REMOTE_DB
      } is connected`
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.connectionDB = { connect, sequelize };
