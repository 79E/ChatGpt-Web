import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const carmiMysql = sequelizeExample.define(
  'carmi',
  {
    user_id: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    key: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.NUMBER
    },
    end_time: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.NUMBER
    },
    create_time: {
      type: DataTypes.STRING
    },
    update_time: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
)

export default carmiMysql
