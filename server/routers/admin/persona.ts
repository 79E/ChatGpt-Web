import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { personaModel } from '../../models'
const router = express.Router()

router.get('/persona', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const signins = await personaModel.getPersonas({ page, page_size })
  res.json(httpBody(0, signins))
})

router.delete('/persona/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await personaModel.delPersona(id)
  res.json(httpBody(0, delRes, '删除成功'))
})

router.post('/persona', async function (req, res, next) {
  const { title, context, description, user_id, avatar, status, system } = req.body
  if (!title || !context || !avatar) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)()
  const addRes = await personaModel.addPersona(
    filterObjectNull({
      id,
      title,
      description,
      status,
      user_id,
      context,
      avatar,
      system
    })
  )
  res.json(httpBody(0, addRes))
})

router.put('/persona', async function (req, res, next) {
  const { id, title, context, description, user_id, avatar, status, system } = req.body
  if (!id || !title || !context || !avatar) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await personaModel.editPersona(id, {
    title,
    description,
    status,
    user_id: user_id ? user_id : null,
    context,
    avatar,
    system
  })
  res.json(httpBody(0, editRes))
})

export default router
