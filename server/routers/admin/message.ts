import express from 'express'
import { httpBody, pagingData } from '../../utils'
import { messageModel } from '../../models'
const router = express.Router()

router.get('/messages', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const signins = await messageModel.getMessages({ page, page_size })
  res.json(httpBody(0, signins))
})

router.delete('/messages/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  await messageModel.delMessage({ id })
  res.json(httpBody(0, '删除成功'))
})

router.put('/messages', async function (req, res, next) {
  const { id, status } = req.body
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  await messageModel.updateMessage({ status }, { id })
  res.json(httpBody(0, '修改成功'))
})

export default router
