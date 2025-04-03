import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const installedPluginMysql = sequelizeExample.define(
  'installed_plugin',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    plugin_id: {
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

export default installedPluginMysql
