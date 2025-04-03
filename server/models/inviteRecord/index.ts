import { sequelize } from '../db'
import userMysql from '../user/mysql'
import inviteRecordMysql from './mysql'

async function addInviteRecord(data?: { [key: string]: any }) {
  const create = await inviteRecordMysql.create({
    ...data
  })
  return create
}

async function getInviteRecord(where?: { [key: string]: any }) {
  const find = await inviteRecordMysql.findOne({
    where
  })
  if (find) return find.toJSON()
  return find
}

async function getInviteRecordAll(where?: { [key: string]: any }) {
  const find = await inviteRecordMysql.findAll({
    where
  })
  return find
}

async function getInviteRecords({ page, page_size }, where?: { [key: string]: any }) {
  inviteRecordMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const find = await inviteRecordMysql.findAndCountAll({
    where,
    include: [
      {
        model: userMysql,
        required: false,
        as: 'user',
        attributes: ['id', 'account', 'avatar', 'nickname']
      }
    ],
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })

  const rows = await Promise.all(
    find.rows.map(async (item) => {
      const json = await item.toJSON()
      const superiorInfo = await userMysql
        .findByPk(json?.superior_id)
        .then((user) => user?.toJSON())
      console.log(superiorInfo)
      if (!superiorInfo) {
        return {
          ...json,
          superior: null
        }
      }

      return {
        ...json,
        superior: {
          id: superiorInfo.id,
          account: superiorInfo.account,
          avatar: superiorInfo.avatar,
          nickname: superiorInfo.nickname
        }
      }
    })
  )

  return { ...find, rows }
}

async function delInviteRecord(id) {
  const del = await inviteRecordMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editInviteRecord(id: number | string, data: { [key: string]: any }) {
  const edit = await inviteRecordMysql.update(
    { ...data },
    {
      where: {
        id
      }
    }
  )
  return edit
}

async function getUserInviteCount(userId: string | number, dates?: Array<Date>) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 59)
  const date = dates && dates.length === 2 ? [...dates] : [today, todayEnd]

  const count = await inviteRecordMysql.count({
    where: {
      superior_id: userId,
      create_time: {
        [sequelize.Op.between]: [...date]
      }
    }
  })

  return {
    invite_count: count || 0
  }
}

export default {
  addInviteRecord,
  getInviteRecords,
  delInviteRecord,
  editInviteRecord,
  getInviteRecord,
  getInviteRecordAll,
  getUserInviteCount
}
