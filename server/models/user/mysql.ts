import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const userMysql = sequelizeExample.define(
  'user',
  {
    account: {
      type: DataTypes.STRING
    },
    nickname: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    integral: {
      type: DataTypes.NUMBER
    },
    cashback_ratio: {
      type: DataTypes.NUMBER
    },
    vip_expire_time: {
      type: DataTypes.STRING
    },
    svip_expire_time: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    invite_code: {
      type: DataTypes.STRING
    },
    superior_id: {
      type: DataTypes.NUMBER
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

export default userMysql
