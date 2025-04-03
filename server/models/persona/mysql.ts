import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const personaMysql = sequelizeExample.define(
  'persona',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    system: {
      type: DataTypes.NUMBER
    },
    title: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    context: {
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

export default personaMysql
