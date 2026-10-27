import { Sequelize } from 'sequelize';

const getSequelizeInstance = (env) => new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASS,
    {
        host: env.DB_SERVER,
        dialect: 'mssql',
        port: 1433,
        logging: false,
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true,
            },
        },
    }
);



export { getSequelizeInstance };