import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const orderMysql = sequelizeExample.define(
  'order',
  {
    trade_no: {
      type: DataTypes.STRING
    },
    pay_type: {
      type: DataTypes.STRING
    },
    product_id: {
      type: DataTypes.NUMBER
    },
    product_title: {
      type: DataTypes.STRING
    },
    trade_status: {
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.NUMBER
    },
    product_info: {
      type: DataTypes.STRING
    },
    channel: {
      type: DataTypes.STRING
    },
    params: {
      type: DataTypes.STRING
    },
    payment_id: {
      type: DataTypes.NUMBER
    },
    payment_info: {
      type: DataTypes.STRING
    },
    money: {
      type: DataTypes.NUMBER
    },
    notify_info: {
      type: DataTypes.STRING
    },
    pay_url: {
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

export default orderMysql
