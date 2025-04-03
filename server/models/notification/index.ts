import { Paging } from '../../type'
import notificationMysql from './mysql'

async function getNotification({ page, page_size }: Paging, where?: { [key: string]: any }) {
  const finds = await notificationMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function delNotification(id) {
  const del = await notificationMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addNotification(data: { [key: string]: any }) {
  const add = await notificationMysql.create(data)
  return add
}

async function editNotification(id: number | string, data: { [key: string]: any }) {
  const edit = await notificationMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

export default {
  getNotification,
  delNotification,
  addNotification,
  editNotification
}
