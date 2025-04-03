import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const notificationMysql = sequelizeExample.define(
  'notification',
  {
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
    sort: {
      type: DataTypes.NUMBER
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

export default notificationMysql
