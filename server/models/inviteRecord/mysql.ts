import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const inviteRecordMysql = sequelizeExample.define(
  'invite_record',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    invite_code: {
      type: DataTypes.STRING
    },
    superior_id: {
      type: DataTypes.NUMBER
    },
    reward: {
      type: DataTypes.STRING
    },
    reward_type: {
      type: DataTypes.STRING
    },
    user_agent: {
      type: DataTypes.STRING
    },
    remarks: {
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

export default inviteRecordMysql
