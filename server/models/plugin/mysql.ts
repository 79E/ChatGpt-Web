import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const pluginMysql = sequelizeExample.define(
  'plugin',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    name: {
      type: DataTypes.NUMBER
    },
    description: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    variables: {
      type: DataTypes.STRING
    },
    function: {
      type: DataTypes.STRING
    },
    script: {
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

export default pluginMysql
