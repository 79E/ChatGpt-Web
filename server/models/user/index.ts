import { productModel, turnoverModel } from '..'
import { formatTime, generateNowflakeId, httpBody } from '../../utils'
import { sequelize } from '../db'
import userMysql from './mysql'

async function getUserInfo(where?: { [key: string]: any }) {
  const findUser = await userMysql.findOne({
    where
  })
  if (!findUser) return null
  return findUser?.toJSON()
}

async function addUserInfo(data: { [key: string]: any }) {
  const addUser = await userMysql.create(data).then((info) => info.toJSON())
  return addUser
}

async function updataUserVIP(data: {
  id: string | number
  type: 'day' | 'integral'
  value: number
  operate: 'increment' | 'decrement'
  level?: number
}) {
  const user = await userMysql.findByPk(data.id)
  const userInfo = await user?.toJSON()
  if (data.type === 'integral') {
    if (data.operate === 'decrement') {
      user?.decrement('integral', {
        by: data.value
      })
    } else if (data.operate === 'increment') {
      user?.increment('integral', {
        by: data.value
      })
    }
  } else if (data.type === 'day') {
    const vipTime = Date.parse(userInfo.vip_expire_time)
    const svipTime = Date.parse(userInfo.svip_expire_time)
    const todayTime = new Date().getTime()
    const addTime = data.value * 86400000
    let vipResultTime = 0
    let svipResultTime = svipTime
    if (vipTime < todayTime) {
      // 这里是否减去1毫秒
      vipResultTime = todayTime + addTime
    } else {
      vipResultTime = vipTime + addTime
    }

    if (data.level && data.level === 2) {
      if (svipTime < todayTime) {
        // 这里是否减去1毫秒
        svipResultTime = todayTime + addTime
      } else {
        svipResultTime = svipTime + addTime
      }
    }
    const vip_expire_time = formatTime('yyyy-MM-dd HH:mm:ss', new Date(vipResultTime))
    const svip_expire_time = formatTime('yyyy-MM-dd HH:mm:ss', new Date(svipResultTime))
    await userMysql.update(
      { vip_expire_time, svip_expire_time },
      {
        where: {
          id: data.id
        }
      }
    )
  }

  return true
}

// 获取用户列表
async function getUsers({ page, page_size }, where?: { [key: string]: any }) {
  const whereData = {}
  if (where?.account) {
    whereData['account'] = {
      [sequelize.Op.like]: `%${where?.account}%`
    }
  }
  const find = await userMysql.findAndCountAll({
    where: whereData,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return find
}

async function delUser(id) {
  const del = await userMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function editUser(data: { [key: string]: any }) {
  const edit = await userMysql.upsert(data)
  return edit
}

async function editUserInfo(id: number | string, data: { [key: string]: any }) {
  const edit = await userMysql.update(
    { ...data },
    {
      where: {
        id
      }
    }
  )
  return edit
}

// 将商品的数据加在用户身上 在创建一个 记录
async function addUserProductQuota(user_id, product_id) {
  if (product_id && user_id) {
    const productInfo = await productModel.getProduct(product_id)
    if (!productInfo) {
      return httpBody<{ value?: string; title?: string }>(-1, {}, '商品不存在')
    }
    let subscribeDay = 0
    let integral = 0
    if (productInfo.type === 'integral') {
      integral = productInfo.value
    } else if (productInfo.type === 'day') {
      subscribeDay = productInfo.value
    }
    await updataUserVIP({
      id: user_id,
      value: integral ? integral : subscribeDay,
      type: productInfo.type,
      level: productInfo.level,
      operate: 'increment'
    })
    return httpBody<{ value: string; title: string }>(
      0,
      {
        ...productInfo,
        value: subscribeDay ? `${productInfo.value}天` : `${productInfo.value}积分`
      },
      '充值成功'
    )
  }

  return httpBody<{ value?: string; title?: string }>(-1, {}, '数据错误')
}

export default {
  getUserInfo,
  addUserInfo,
  updataUserVIP,
  getUsers,
  delUser,
  editUser,
  addUserProductQuota,
  editUserInfo
}
