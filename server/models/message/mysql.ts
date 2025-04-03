import { DataTypes } from 'sequelize'
import { sequelizeExample } from '../db'

export const messageMysql = sequelizeExample.define(
  'message',
  {
    content: {
      type: DataTypes.STRING
    },
    persona_id: {
      type: DataTypes.NUMBER
    },
    user_id: {
      type: DataTypes.NUMBER
    },
    plugin_id: {
      type: DataTypes.NUMBER
    },
    role: {
      type: DataTypes.STRING
    },
    frequency_penalty: {
      type: DataTypes.NUMBER
    },
    max_tokens: {
      type: DataTypes.NUMBER
    },
    model: {
      type: DataTypes.STRING
    },
    presence_penalty: {
      type: DataTypes.NUMBER
    },
    temperature: {
      type: DataTypes.NUMBER
    },
    parent_message_id: {
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

export default messageMysql
