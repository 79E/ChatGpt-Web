import { sequelize } from '../db'
import drawRecordMysql from './mysql'
import userMysql from '../user/mysql';

async function addDrawRecord(data: { [key: string]: any }) {
  const create = await drawRecordMysql.create(data)
  return create
}

async function getDrawRecord({ page, page_size, user_id, type, status = 1 }) {
  let where: { [key: string]: any } = {
    status
  }
  if (type === 'me' && user_id) {
    where = {
      status: {
        [sequelize.Op.gte]: 1
      },
      user_id
    }
  }
  const finds = await drawRecordMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  const rows: Array<{ [key: string]: string | number }> = []

  for (const item of finds.rows) {
    const json = await item.toJSON()
    rows.push({
      ...json,
      images: JSON.parse(json.images)
    })
  }

  return {
    count: finds.count,
    rows,
  }
}

async function getDrawRecords({ page, page_size }) {
  drawRecordMysql.belongsTo(userMysql, { foreignKey:'user_id', targetKey:'id' });
  const finds = await drawRecordMysql.findAndCountAll({
    where: {},
    include:[
      {
        model: userMysql,
        required:false,
      }
    ],
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  const rows: Array<{ [key: string]: string | number }> = []

  for (const item of finds.rows) {
    const json = await item.toJSON()
    rows.push({
      ...json,
      images: JSON.parse(json.images)
    })
  }

  return {
    count: finds.count,
    rows,
  }
}

async function setDrawRecord({ id, status, user_id }: { id?: number, status: number, user_id: number | string }) {
  const where: { [key: string]: any } = {
    status: {
      [sequelize.Op.gt]: 0
    },
    user_id
  }

  if (id) {
    where.id = id
  }

  const update = await drawRecordMysql.update({ status }, {
    where
  })

  return update
}

async function delDrawRecord(id) {
  const del = await drawRecordMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editDrawRecord(id: number | string, data: { [key: string]: any }) {
  const edit = await drawRecordMysql.update(data, {
    where: {
      id
    }
  })
  return edit
}

export default {
  getDrawRecord,
  addDrawRecord,
  setDrawRecord,
  getDrawRecords,
  delDrawRecord,
  editDrawRecord
}
