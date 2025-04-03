import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const cashbackMysql = sequelizeExample.define(
  'cashback',
  {
    user_id: {
      type: DataTypes.STRING
    },
    benefit_id: {
      type: DataTypes.STRING
    },
    pay_amount: {
      type: DataTypes.STRING
    },
    commission_rate: {
      type: DataTypes.STRING
    },
    commission_amount: {
      type: DataTypes.NUMBER
    },
    remarks: {
      type: DataTypes.STRING
    },
    order_id: {
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

export default cashbackMysql
