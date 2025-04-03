import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { dialogModel } from '../../models'
const router = express.Router()

router.get('/dialog', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const rows = await dialogModel.getDialogs({ page, page_size })
  res.json(httpBody(0, rows))
})

router.delete('/dialog/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await dialogModel.delDialog(id)
  res.json(httpBody(0, delRes))
})

router.post('/dialog', async function (req, res, next) {
  const { issue, answer, models, status = 1, delay = 0 } = req.body
  if (!issue || !answer || !models) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)()
  const addRes = await dialogModel.addDialog({
    id,
    issue,
    answer,
    delay,
    status,
    models
  })
  res.json(httpBody(0, addRes))
})

router.put('/dialog', async function (req, res, next) {
  const { id, issue, answer, models, status, delay = 0 } = req.body
  if (!id || !issue || !answer || !models) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await dialogModel.editDialog(
    id,
    filterObjectNull({
      issue,
      answer,
      delay,
      models,
      status
    })
  )
  res.json(httpBody(0, editRes))
})

export default router
