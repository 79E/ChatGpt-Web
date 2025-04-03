import { sequelize } from '../db'
import dialogMysql from './mysql'

async function getDialogs({ page, page_size }, where?: { [key: string]: any }) {
  const find = await dialogMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return find
}

async function delDialog(id) {
  const del = await dialogMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addDialog(data: { [key: string]: any }) {
  const add = await dialogMysql.create(data)
  return add
}

async function editDialog(id: number | string, data: { [key: string]: any }) {
  const edit = await dialogMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

async function getOneDialogInfo({ model, issue }: { issue: string , model: string }) {
  const find = await dialogMysql
    .findOne({
      where: {
        status: 1,
		issue,
        [sequelize.Op.or]: [
          { models: { [sequelize.Op.like]: `${model},%` } },
          { models: { [sequelize.Op.like]: `%,${model}` } },
          { models: { [sequelize.Op.like]: `%,${model},%` } },
          { models: { [sequelize.Op.eq]: model } }
        ]
      },
      order: sequelize.literal('RAND()')
    })
    .then((info) => info?.toJSON())
  return find
}

export default {
  getDialogs,
  delDialog,
  addDialog,
  editDialog,
  getOneDialogInfo
}
