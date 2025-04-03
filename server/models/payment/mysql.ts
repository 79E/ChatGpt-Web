import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const paymentMysql = sequelizeExample.define(
  'payment',
  {
    name: {
      type: DataTypes.STRING
    },
    channel: {
      type: DataTypes.STRING
    },
    types: {
      type: DataTypes.STRING
    },
    params: {
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

export default paymentMysql
