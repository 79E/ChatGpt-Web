import { sequelize } from '../db'
import { Paging } from '../../type'
import userMysql from '../user/mysql'
import pluginMysql from './mysql'
import { filterObjectNull } from '../../utils'

async function getPlugins({ page, page_size }: Paging, where?: { [key: string]: any }) {
  pluginMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const finds = await pluginMysql.findAndCountAll({
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

async function getUserPluginAll(user_id?: string | number) {
  pluginMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const finds = await pluginMysql.findAll({
    where: {
      [sequelize.Op.or]: {
        user_id,
        status: 1
      }
    },
    include: [
      {
        model: userMysql,
        required: false,
        attributes: ['id', 'account', 'avatar', 'nickname']
      }
    ],
    // attributes: {
    //   exclude: ['function', 'script', 'variables']
    // },
    order: [['create_time', 'DESC']]
  })

  const list = finds.map((item) => {
    const json = item.toJSON()
    if (json.user_id === user_id) {
      return {
        ...json
      }
    }
    return filterObjectNull({
      ...json,
      function: null,
      script: null,
      variables: null
    })
  })

  return [...list]
}

async function delPlugin(id) {
  const del = await pluginMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addPlugin(data: { [key: string]: any }) {
  const add = await pluginMysql.create(data)
  return add
}

async function editPlugin(id: number | string, data: { [key: string]: any }) {
  const edit = await pluginMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

async function getInPlugins(ids: Array<number>, where?: { [key: string]: any }) {
 const data = await pluginMysql.findAll({
    where: {
      id: {
        [sequelize.Op.in]: [...ids]
      },
      status: {
        [sequelize.Op.ne]: 0
      },
	  ...where
    }
  })

  if(!data) return []
  return data.map(item => item.toJSON())
}

export default {
  getPlugins,
  delPlugin,
  addPlugin,
  editPlugin,
  getUserPluginAll,
  getInPlugins
}
