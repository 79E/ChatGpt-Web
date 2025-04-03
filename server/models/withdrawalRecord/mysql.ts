import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const withdrawalRecordMysql = sequelizeExample.define(
  'withdrawal_record',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    amount: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    contact: {
      type: DataTypes.STRING
    },
    account: {
      type: DataTypes.STRING
    },
    remarks: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
	user_agent: {
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

export default withdrawalRecordMysql
