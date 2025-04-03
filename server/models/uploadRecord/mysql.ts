import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const uploadRecordMysql = sequelizeExample.define(
  'upload_record',
  {
    user_id: {
      type: DataTypes.NUMBER
    },
    mimetype: {
      type: DataTypes.STRING
    },
    sha1: {
      type: DataTypes.STRING
    },
    md5: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    originalname: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.STRING
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

export default uploadRecordMysql
