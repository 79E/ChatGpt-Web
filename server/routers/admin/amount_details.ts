import express from 'express'
import {
  filterObjectNull,
  formatTime,
  generateMd5,
  generateNowflakeId,
  generateUUID,
  httpBody,
  pagingData
} from '../../utils'
import { amountDetailsModel } from '../../models'
const router = express.Router()

router.get('/amount_details', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const data = await amountDetailsModel.getAmountDetails({ page, page_size })
  res.json(httpBody(0, data))
})

router.delete('/amount_details/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await amountDetailsModel.delAmountDetail(id)
  res.json(httpBody(0, delRes))
})

router.put('/amount_details', async function (req, res, next) {
  const { id } = req.body
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await amountDetailsModel.updateAmountDetail(
    filterObjectNull({
      ...req.body
    }),
    {
      id
    }
  )
  res.json(httpBody(0, editRes))
})

router.post('/amount_details', async function (req, res, next) {
  const { user_id, operate_amount, correlation_id } = req.body
  if (!user_id || !operate_amount || !correlation_id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)();
  const addRes = await amountDetailsModel.addAmountDetails({
    user_id,
    operate_amount,
    correlation_id,
    ...filterObjectNull({
      ...req.body
    }),
	id,
  })
  res.json(httpBody(0, addRes))
})

export default router
