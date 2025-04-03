import { Paging } from '../../type'
import { sequelize } from '../db'
import aikeyMysql from './mysql'

async function getOneAikey({ model, type }: { model?: string; type?: string }) {
  const where = {
    status: 1
  }
  if (type) {
    where['type'] = type
  }
  if (model) {
    where[sequelize.Op.or] = [
      { models: { [sequelize.Op.like]: `${model},%` } },
      { models: { [sequelize.Op.like]: `%,${model}` } },
      { models: { [sequelize.Op.like]: `%,${model},%` } },
      { models: { [sequelize.Op.eq]: model } }
    ]
  }
  const find = await aikeyMysql
    .findOne({
      where,
      order: sequelize.literal('RAND()')
    })
    .then((info) => info?.toJSON())
  return find
}

async function getAikeys({ page, page_size }: Paging, where?: { [key: string]: any }) {
  const finds = await aikeyMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function getAiKeyModels({ type }: { type?: 'draw' | 'chat' }) {
  const finds = await aikeyMysql.findAll({
    where: {
      status: 1
    }
  })
  const chatArray: Array<{[key: string]: any}> = []
  const drawArray: Array<{[key: string]: any}>= []

  finds.forEach((item) => {
    const json = item.toJSON()
	const [app, type] = json.type.split('-')
    const models = [...json.models.split(',')].map((value) => ({
		label: value,
		value: value,
		type,
		app,
	}))
    const isDraw = type === 'draw' && (json.type as string).includes('draw')
    const isChat = type === 'chat' && (json.type as string).includes('chat')
    if (isChat) {
      chatArray.push(...models)
    }
    if (isDraw) {
      drawArray.push(...models)
    }
  })

  function uniqueByValue(arr) {
	const set = new Set();
	return arr.filter(item => {
	  if (set.has(item.value)) {
		return false;
	  } else {
		set.add(item.value);
		return true;
	  }
	});
  }

  const chat_models = uniqueByValue(chatArray)

  const draw_models = uniqueByValue(drawArray)

  return {
    chat_models,
    draw_models
  }
}

async function delAikey(id) {
  const del = await aikeyMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addAikey(data: { [key: string]: any }) {
  const add = await aikeyMysql.create(data)
  return add
}

async function editAikey(id: number | string, data: { [key: string]: any }) {
  const edit = await aikeyMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

export default {
  getOneAikey,
  getAikeys,
  delAikey,
  addAikey,
  editAikey,
  getAiKeyModels
}
