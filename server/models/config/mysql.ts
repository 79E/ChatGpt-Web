import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const configMysql = sequelizeExample.define(
  'config',
  {
    name: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
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

export default configMysql
