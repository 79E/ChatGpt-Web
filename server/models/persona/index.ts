import { sequelize } from '../db'
import { Paging } from '../../type'
import userMysql from '../user/mysql'
import personaMysql from './mysql'

async function getPersonas({ page, page_size }: Paging, where?: { [key: string]: any }) {
  personaMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const finds = await personaMysql.findAndCountAll({
    where,
    include: [
      {
        model: userMysql,
        required: false,
        attributes: ['id', 'account', 'avatar', 'nickname']
      }
    ],
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function getAllPersona() {
  personaMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const finds = await personaMysql.findAll({
    where: {
      status: 1,
      system: 0
    },
    include: [
      {
        model: userMysql,
        required: false,
        attributes: ['id', 'account', 'avatar', 'nickname']
      }
    ],
	order: [['create_time', 'DESC']],
  })

  return finds
}

async function getRandomPersonas(limit = 9) {
  const finds = await personaMysql.findAll({
    order: sequelize.literal('rand()'),
    limit,
    where: {
      status: 1,
      system: 0
    }
  })
  return finds
}

async function delPersona(id) {
  const del = await personaMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addPersona(data: { [key: string]: any }) {
  const add = await personaMysql.create(data)
  return add
}

async function editPersona(id: number | string, data: { [key: string]: any }) {
  const edit = await personaMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

async function getPersonaContext(where: { 
  id?: string,
  status: number,
  system: number
}) {
  const info = await personaMysql.findOne({
    where: {
      ...where
    }
  })
  let context: Array<{ [key: string]: string }> = []
  if (!info) return context
  const json = await info.toJSON()
  try {
    context = JSON.parse(json.context)
  } catch (error) {
    context = []
  }

  return context
    .map((item) => {
      return {
        role: item.role,
        content: item.content
      }
    })
    .reverse()
}

export default {
  getPersonas,
  delPersona,
  addPersona,
  editPersona,
  getRandomPersonas,
  getPersonaContext,
  getAllPersona
}
