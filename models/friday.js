import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Friday = sequelize.define('friday', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: '_group',
      key: 'group_id',
    },
  },
  firstLesson: {
    type: DataTypes.STRING(255),
  },
  secondLesson: {
    type: DataTypes.STRING(255),
  },
  thirdLesson: {
    type: DataTypes.STRING(255),
  },
  fourthLesson: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'friday',
  timestamps: false
});

export default Friday;