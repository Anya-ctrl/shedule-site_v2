import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import Group from './group.js';

const Course = sequelize.define('course', {
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    course: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'course',
    timestamps: false
});

Course.belongsTo(Group, { foreignKey: 'course_id' });

export default Course;
