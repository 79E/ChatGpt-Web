import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const amountDetailsMysql = sequelizeExample.define(
  'amount_details',
  {
    user_id: {
      type: DataTypes.STRING
    },
    correlation_id: {
      type: DataTypes.STRING
    },
    original_amount: {
      type: DataTypes.STRING
    },
    operate_amount: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    current_amount: {
      type: DataTypes.NUMBER
    },
    remarks: {
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

export default amountDetailsMysql
