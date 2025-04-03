
import userMysql from '../user/mysql';
import actionMysql from './mysql'

async function addAction(data: {[key: string]: any}) {
  const create = await actionMysql.create(data)
  return create
}

async function getActions({ page, page_size }, where?: { [key: string]: any }) {
  actionMysql.belongsTo(userMysql, { foreignKey:'user_id', targetKey:'id' });
  const find = await actionMysql.findAndCountAll({
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

export default {
  addAction,
  getActions
}
