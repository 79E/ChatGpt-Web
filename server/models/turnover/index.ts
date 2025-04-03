import { Paging } from '../../type'
import userMysql from '../user/mysql';
import turnoverMysql from './mysql'

async function addTurnover(data: {[key:string]:any}) {
  const create = await turnoverMysql.create(data)
  return create
}
async function getUserTurnovers({ page, page_size }: Paging, where?: { [key: string]: any }) {
  const finds = await turnoverMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function getTurnovers({ page, page_size }, where?: { [key: string]: any }) {
  turnoverMysql.belongsTo(userMysql, { foreignKey:'user_id', targetKey:'id' });
  const find = await turnoverMysql.findAndCountAll({
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

async function delTurnover(id) {
  const del = await turnoverMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editTurnover(data: {[key: string]: string}) {
  const res = await turnoverMysql.upsert({
    ...data
  });
  return res
}

export default {
  addTurnover,
  getUserTurnovers,
  delTurnover,
  getTurnovers,
  editTurnover
}
