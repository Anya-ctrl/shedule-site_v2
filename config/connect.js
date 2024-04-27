import Sequelize from 'sequelize';
import configEnv from "./db.config.js"

// Database connection
const sequelize = new Sequelize(configEnv.DATABASE, configEnv.USER, configEnv.PASSWORD, {
    host: configEnv.HOST,
    dialect: configEnv.DIALECT,
});

export default sequelize;