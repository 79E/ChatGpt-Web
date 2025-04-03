import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { notificationModel } from '../../models'
const router = express.Router()

router.get('/notification', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const tokens = await notificationModel.getNotification({ page, page_size })
  res.json(httpBody(0, tokens))
})

router.delete('/notification/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await notificationModel.delNotification(id)
  res.json(httpBody(0, delRes))
})

router.post('/notification', async function (req, res, next) {
  const { title, content, sort, status } = req.body
  if (!title || !content) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)()
  const addRes = await notificationModel.addNotification({
    id,
    title,
    content,
    sort,
    status
  })
  res.json(httpBody(0, addRes))
})

router.put('/notification', async function (req, res, next) {
  const { id, title, content, sort, status } = req.body
  if (!id || !title || !content) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await notificationModel.editNotification(
    id,
    filterObjectNull({
      title,
      content,
      sort,
      status
    })
  )
  res.json(httpBody(0, editRes))
})

export default router
