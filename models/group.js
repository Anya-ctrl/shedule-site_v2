import sequelize from '../config/connect.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Group = sequelize.define('_group', {
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_name: {
    type: DataTypes.STRING(10),
  },
}, {
  tableName: '_group',
  timestamps: false
});

export default Group;
