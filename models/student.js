import { DataTypes } from 'sequelize';
import sequelize from '../config/connect.js';
import dotenv from 'dotenv';
dotenv.config();

import Group from './group.js';

const Student = sequelize.define('student', {
    student_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    surname: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
    },
}, {
  tableName: 'student',
  timestamps: false
});

Student.belongsTo(Group, { foreignKey: 'group_id' });
  
export default Student;