import express from 'express'
import {
  filterObjectNull,
  generateCrc,
  generateMd5,
  generateNowflakeId,
  getClientIP,
  httpBody,
  pagingData
} from '../../utils'
import { userModel } from '../../models'
const router = express.Router()

router.post('/user', async function (req, res, next) {
  const {
    account,
    nickname = 'ChatGpt',
    avatar = 'https://u1.dl0.cn/icon/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
    status = 1,
    role = 'user',
    superior_id,
    password,
    integral = 0,
    vip_expire_time = '2020-02-02 22:02:02',
    svip_expire_time = '2020-02-02 22:02:02'
  } = req.body

  if (!account || !password) {
    res.status(500).json(httpBody(-1, '缺少必要参数'))
    return
  }

  const user_agent = req.headers['user-agent'] || ''
  const ip = getClientIP(req)
  const id = generateNowflakeId(1)()
  const userInfo = await userModel.addUserInfo(
    filterObjectNull({
      id,
      account,
      ip,
      nickname,
      avatar,
      status,
      role,
      password: generateMd5(password),
      integral,
      vip_expire_time,
      svip_expire_time,
      invite_code: generateCrc.crc32(`${id}_${Date.now()}`),
      user_agent,
      superior_id
    })
  )

  res.json(httpBody(0, userInfo, '新增成功'))
})

router.get('/user', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const { account } = req.query
  const carmis = await userModel.getUsers({ page, page_size }, { account })
  res.json(httpBody(0, carmis))
})

router.delete('/user/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await userModel.delUser(id)
  res.json(httpBody(0, delRes))
})

router.put('/user', async function (req, res, next) {
  const {
    id,
    account,
    status,
    avatar,
    integral,
    nickname,
    role,
    vip_expire_time,
    svip_expire_time,
	cashback_ratio
  } = req.body
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  // 修改用户
  const editRes = await userModel.editUserInfo(
    id,
    filterObjectNull({
      id,
      account,
      avatar,
      integral,
      nickname,
      status,
      role,
      vip_expire_time,
      svip_expire_time,
	  cashback_ratio
    })
  )
  res.json(httpBody(0, editRes))
})

export default router
