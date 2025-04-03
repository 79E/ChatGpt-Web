import { sequelize } from '../db'
import amountDetailsMysql from './mysql'
import userMysql from '../user/mysql'

async function getAmountDetail(where?: { [key: string]: any }) {
  const find = await amountDetailsMysql.findOne({
    where,
    order: [['create_time', 'DESC']],
    limit: 1
  })
  if (find) return find.toJSON()
  return find || { current_amount: 0 }
}

async function updateAmountDetail(data: { [key: string]: any }, where?: { [key: string]: any }) {
  const update = await amountDetailsMysql.update(data, {
    where: {
      ...where
    }
  })
  return update
}

async function getAmountDetails({ page, page_size }, where?: { [key: string]: any }) {
  amountDetailsMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const find = await amountDetailsMysql.findAndCountAll({
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

  return find
}

async function delAmountDetail(id) {
  const del = await amountDetailsMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addAmountDetails(data: {
  user_id: string | number
  operate_amount: number
  correlation_id: string | number
  [key: string]: string | number
}) {
  const create = await amountDetailsMysql.create({ ...data })
  return create
}

export default {
  getAmountDetail,
  addAmountDetails,
  getAmountDetails,
  delAmountDetail,
  updateAmountDetail
}
