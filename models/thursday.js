import { DataTypes } from 'sequelize';
import sequelize from '../config/connect.js';
import dotenv from 'dotenv';
dotenv.config();

const Thursday = sequelize.define('thursday', {
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
  tableName: 'thursday',
  timestamps: false
});

export default Thursday;