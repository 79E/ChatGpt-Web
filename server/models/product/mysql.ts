import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const productMysql = sequelizeExample.define(
  'product',
  {
    title: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.NUMBER
    },
    original_price: {
      type: DataTypes.NUMBER
    },
    value: {
      type: DataTypes.NUMBER
    },
    badge: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.NUMBER
    },
    sort: {
      type: DataTypes.NUMBER
    },
    describe: {
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

export default productMysql
