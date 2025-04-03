import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const aikeyMysql = sequelizeExample.define(
  'aikey',
  {
    key: {
      type: DataTypes.STRING
    },
    host: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
    models: {
      type: DataTypes.STRING
    },
	check: {
		type: DataTypes.NUMBER
	},
    usage: {
      type: DataTypes.NUMBER
    },
    limit: {
      type: DataTypes.NUMBER
    },
    type: {
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

export default aikeyMysql
