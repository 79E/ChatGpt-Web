import { sequelize } from '../db'
import userMysql from '../user/mysql'
import carmiMysql from './mysql'

async function addSignin(data?: { [key: string]: any }) {
  const create = await carmiMysql.create({
    ...data
  })
  return create
}

async function getUserDaySignin(user_id: string, time?: string) {
  const findOne = await carmiMysql.findOne({
    where: {
      user_id,
      create_time: {
        [sequelize.Op.gte]: time
      }
    }
  })
  if(findOne) return true;
  return false
}

async function getSignins({ page, page_size }, where?: { [key: string]: any }) {
  carmiMysql.belongsTo(userMysql, { foreignKey:'user_id', targetKey:'id' });
  const find = await carmiMysql.findAndCountAll({
    where,
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
  return find
}

async function getUserSigninList(user_id, { start_time, end_time }) {
  const list = await carmiMysql.findAll({
    where: {
      user_id,
      status: 1,
      create_time: {
        [sequelize.Op.gte]: start_time,
        [sequelize.Op.lt]: end_time,
      }
    }
  })
  return list
}

export default {
  addSignin,
  getUserDaySignin,
  getSignins,
  getUserSigninList
}
