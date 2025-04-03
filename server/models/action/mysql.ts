import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const actionMysql = sequelizeExample.define(
  'action',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    type: {
      type: DataTypes.STRING
    },
    describe: {
      type: DataTypes.STRING
    },
    ip: {
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

export default actionMysql
