import { MessageInfo } from '../../type'
import userMysql from '../user/mysql'
import personaMysql from '../persona/mysql'
import messageMysql from './mysql'
import pluginMysql from '../plugin/mysql'

async function addMessages(datas: Array<{ [key: string]: any }>) {
  const captains = await messageMysql.bulkCreate([...datas])
  return captains
}

async function getMessages({ page, page_size }, where?: { [key: string]: any }) {
  messageMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  messageMysql.belongsTo(personaMysql, { foreignKey: 'persona_id', targetKey: 'id' })
  messageMysql.belongsTo(pluginMysql, { foreignKey: 'plugin_id', targetKey: 'id' })
  const find = await messageMysql.findAndCountAll({
    where,
    include: [
      {
        model: userMysql,
        required: false
      },
	    {
        model: personaMysql,
        required: false
      },
      {
        model: pluginMysql,
        required: false
      }
    ],
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return find
}

async function getUserMessages(user_id) {
  messageMysql.belongsTo(pluginMysql, { foreignKey: 'plugin_id', targetKey: 'id' })
  return await messageMysql
    .findAll({
      where: {
        user_id,
        status: 1
      },
      include: [
        {
          model: pluginMysql,
          attributes: [
            'id', 'name', 'avatar', 'description'
          ],
          required: false
        }
      ],
      order: [['create_time', 'ASC']],
    })
    .then((messages) => {
      const groups: Array<any> = []
      let currentGroup: Array<any> = []
      let currentParentMessageId: string | undefined = undefined

      messages.forEach((message: { [key: string]: any }) => {
        if (message.parent_message_id !== currentParentMessageId) {
          if (currentGroup.length > 0) {
            groups.push(currentGroup)
          }
          currentGroup = []
          currentParentMessageId = message.parent_message_id
        }

        currentGroup.push({
          user_id: message.user_id,
          dateTime: message.create_time,
          role: message.role,
          status: 'pass',
          text: message.content,
		      persona_id: message.persona_id,
          plugin_id: message.plugin_id,
          plugin_info: message.plugin,
          requestOptions: {
            parentMessageId: message.parent_message_id,
            prompt: message.content,
            options: {
              frequency_penalty: message.frequency_penalty,
              max_tokens: message.max_tokens,
              model: message.model,
              presence_penalty: message.presence_penalty,
              temperature: message.temperature
            }
          }
        })
      })

      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }

      const chats = groups.map((m) => {
        return {
          data: m,
          id: m[0].requestOptions.parentMessageId,
          path: m[0].requestOptions.parentMessageId,
          name: m[0].text,
		      persona_id: m[0].persona_id,
        }
      })

      return chats.reverse()
    })
}

async function updateChats(where: { [key: string]: string }) {
  const del = await messageMysql.update(
    { status: 0 },
    {
      where
    }
  )
  return del
}

async function updateMessage(data: { [key: string]: string },where: { [key: string]: string }) {
	const del = await messageMysql.update(
	  { ...data },
	  {
		where
	  }
	)
	return del
  }

async function delMessage(where: { [key: string]: string }) {
  const del = await messageMysql.destroy({
    where: {
      ...where
    }
  })
  return del
}

export default {
  addMessages,
  getMessages,
  getUserMessages,
  updateChats,
  delMessage,
  updateMessage
}
