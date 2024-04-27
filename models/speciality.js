import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import Faculty from './faculty.js';
import Group from './group.js';

const Speciality = sequelize.define('speciality', {
    speciality_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    speciality: {
        type: DataTypes.STRING(100),
    },
}, {
    tableName: 'speciality',
    timestamps: false
});

Speciality.belongsTo(Faculty, { foreignKey: 'faculty_id' });
Speciality.belongsTo(Group, { foreignKey: 'speciality_id' });

export default Speciality;
