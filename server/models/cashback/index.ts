import { sequelize } from '../db'
import userMysql from '../user/mysql'
import cashbackMysql from './mysql'

async function addCashback(data: { [key: string]: string | number }) {
  const create = await cashbackMysql.create(data)
  return create
}

async function getCashbackInfo(where: { [key: string]: string | number }) {
  const find = await cashbackMysql.findOne({
    where
  })

  if (find) return find.toJSON()
  return find
}

async function getCashback({ page, page_size }, where?: { [key: string]: any }) {
  cashbackMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const find = await cashbackMysql.findAndCountAll({
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
      const superiorInfo = await userMysql.findByPk(json?.benefit_id).then((user) => user?.toJSON())
	  if(!superiorInfo){
		return {
			...json,
			benefit: null
		}
	  }
      return {
        ...json,
        benefit: {
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

async function delCashback(id) {
  const del = await cashbackMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editCashback(id: number | string, data: { [key: string]: any }) {
  const edit = await cashbackMysql.update(
    { ...data },
    {
      where: {
        id
      }
    }
  )
  return edit
}

async function getUserCashbackAmount(
  key: string,
  where?: { [key: string]: string | number },
  dates?: Array<Date>
) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 59)
  const date = dates && dates.length === 2 ? [...dates] : [today, todayEnd]
  const amount = await cashbackMysql.sum(key, {
    where: {
      ...where,
      create_time: {
        [sequelize.Op.between]: [...date]
      }
    }
  })

  return {
    [key]: amount || 0
  }
}

export default {
  addCashback,
  getCashback,
  delCashback,
  editCashback,
  getCashbackInfo,
  getUserCashbackAmount
}
