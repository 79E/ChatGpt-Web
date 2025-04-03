import userMysql from '../user/mysql'
import withdrawalRecordMysql from './mysql'

async function addWithdrawalRecord(data?: { [key: string]: any }) {
  const create = await withdrawalRecordMysql.create({
    ...data
  })
  return create
}

async function getWithdrawalRecord(where?: { [key: string]: any }) {
  const find = await withdrawalRecordMysql.findOne({
    where
  })
  if (find) return find.toJSON()
  return find
}

async function getWithdrawalRecords({ page, page_size }, where?: { [key: string]: any }) {
  withdrawalRecordMysql.belongsTo(userMysql, { foreignKey: 'user_id', targetKey: 'id' })
  const find = await withdrawalRecordMysql.findAndCountAll({
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

  return { ...find }
}

async function delWithdrawalRecord(id) {
  const del = await withdrawalRecordMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editWithdrawalRecord(id: number | string, data: { [key: string]: any }) {
  const edit = await withdrawalRecordMysql.update(
    { ...data },
    {
      where: {
        id
      }
    }
  )
  return edit
}

export default {
  addWithdrawalRecord,
  delWithdrawalRecord,
  editWithdrawalRecord,
  getWithdrawalRecord,
  getWithdrawalRecords
}
