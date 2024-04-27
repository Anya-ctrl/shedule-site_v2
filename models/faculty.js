import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Faculty = sequelize.define('faculty', {
    faculty_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    faculty: {
        type: DataTypes.STRING(100),
    },
}, {
    tableName: 'faculty',
    timestamps: false
});

export default Faculty;
