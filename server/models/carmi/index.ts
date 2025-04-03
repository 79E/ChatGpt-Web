import { sequelize } from '../db'
import carmiMysql from './mysql'
import userMysql from '../user/mysql';

async function getCarmiInfo(where?: { [key: string]: any }) {
  const find = await carmiMysql.findOne({
    where
  })
  return find
}

async function updateCarmiInfo(data: { [key: string]: any }, where?: { [key: string]: any }) {
  const update = await carmiMysql.update(data, {
    where: {
      ...where
    }
  })
  return update
}

// 获取卡密列表
async function getCarmis({ page, page_size }, where?: { [key: string]: any }) {
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

async function delCarmi(id) {
  const del = await carmiMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addCarmis(datas: Array<{[key: string]: string | number}>) {
  const captains = await carmiMysql.bulkCreate([...datas])
  return captains
}

// 清理过期的卡密
async function checkCarmiEndTime (time: string) {
  const captains = await carmiMysql.update({
    status: 2
  },{
    where: {
      end_time: {
        [sequelize.Op.lt]: time,
        [sequelize.Op.ne]: ''
      },
      status: 0
    }
  })
  return captains;
}

export default {
  getCarmiInfo,
  updateCarmiInfo,
  getCarmis,
  delCarmi,
  addCarmis,
  checkCarmiEndTime
}
