import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const signinMysql = sequelizeExample.define(
  'signin',
  {
    user_id: {
      type: DataTypes.STRING
    },
    ip: {
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

export default signinMysql
