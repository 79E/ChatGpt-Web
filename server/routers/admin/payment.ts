import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { paymentModel } from '../../models'
const router = express.Router()

router.get('/payment', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const all = await paymentModel.getPayments({ page, page_size })
  res.json(httpBody(0, all))
})

router.delete('/payment/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await paymentModel.delPayment(id)
  res.json(httpBody(0, delRes))
})

router.post('/payment', async function (req, res, next) {
  const { channel, name, params, types, status = 1 } = req.body
  if (!channel || !name || !params || !types) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)()
  const addRes = await paymentModel.addPayment(
    filterObjectNull({
      id,
      channel,
      name,
      params,
      types,
      status
    })
  )
  res.json(httpBody(0, addRes))
})

router.put('/payment', async function (req, res, next) {
  const { id, channel, name, params, types, status } = req.body
  if (!id || !channel || !name || !params || !types) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await paymentModel.editPayment(
    filterObjectNull({
      id,
      channel,
      name,
      params,
      types,
      status
    })
  )
  res.json(httpBody(0, editRes))
})

export default router
