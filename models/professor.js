import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Professor = sequelize.define('professor', {
    professor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    link: {
      type: DataTypes.STRING(255),
    },
}, {
  tableName: 'professor',
  timestamps: false
});
  
export default Professor;