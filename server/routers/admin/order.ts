import express from 'express'
import { httpBody, pagingData } from '../../utils'
import { orderModel } from '../../models'
const router = express.Router()

router.get('/orders', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const all = await orderModel.getOrders({ page, page_size })
  res.json(httpBody(0, all))
})

export default router
