import express from 'express'
import { httpBody, pagingData } from '../../utils'
import { actionModel } from '../../models'
const router = express.Router()

// 获取卡密列表
router.get('/action', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const actions = await actionModel.getActions({ page, page_size })
  res.json(httpBody(0, actions))
})

export default router
