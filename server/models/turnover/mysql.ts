import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const turnoverMysql = sequelizeExample.define(
  'turnover',
  {
    user_id: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.NUMBER
    },
    describe: {
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

export default turnoverMysql
