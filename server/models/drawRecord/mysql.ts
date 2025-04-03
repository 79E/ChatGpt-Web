import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const drawRecordMysql = sequelizeExample.define(
  'draw_record',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    inset_image_url: {
      type: DataTypes.STRING
    },
    prompt: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    images: {
      type: DataTypes.STRING
    },
    params: {
      type: DataTypes.STRING
    },
    take_time: {
      type: DataTypes.STRING
    },
    size: {
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

export default drawRecordMysql
