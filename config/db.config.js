import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export default {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
    DIALECT: process.env.DB_DIALECT,
    PORT: process.env.PORT,
    SECRET: process.env.JWT_SECRET
};