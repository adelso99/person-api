import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { getSequelizeInstance } from './utils/db.js';
import { definePersonModel } from './models/person.model.js';
import { createPersonRouter } from './routes/person.routes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const environment = process.env.NODE_ENV || 'development';
const envFile = environment === 'production' ? '.env' : '.env.local';
dotenv.config({
    path: fileURLToPath(new URL(`../${envFile}`, import.meta.url)),
});

const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerDocument = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de personas',
            version: '1.0.0',
            description: 'API para administrar personas con eliminación lógica',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [
        fileURLToPath(
            new URL('./routes/person.routes.js', import.meta.url)
        ).replaceAll('\\', '/'),
    ],
});

const sequelize = getSequelizeInstance(process.env);
const Person = definePersonModel(sequelize);

await sequelize.authenticate();

app.use('/person', createPersonRouter(Person));

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.listen(PORT, () => {
    console.log(`Servidor disponible en http://localhost:${PORT}`);
});

