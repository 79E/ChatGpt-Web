import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { pluginModel } from '../../models'
const router = express.Router()

router.get('/plugins', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const data = await pluginModel.getPlugins({ page, page_size })
  res.json(httpBody(0, data))
})

router.delete('/plugin/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const delRes = await pluginModel.delPlugin(id)
  res.json(httpBody(0, delRes))
})

router.post('/plugin', async function (req, res, next) {
  const { name, description, avatar, variables, function: fun, script, status, user_id } = req.body
  if (!name || !description || !avatar || !fun || !script) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const id = generateNowflakeId(1)()
  const addRes = await pluginModel.addPlugin(
    filterObjectNull({
      id,
      name,
      description,
      avatar,
      variables,
      function: fun,
      script,
      status,
      user_id
    })
  )
  res.json(httpBody(0, addRes))
})

router.put('/plugin', async function (req, res, next) {
  const {
    id,
    name,
    description,
    avatar,
    variables,
    function: fun,
    script,
    status,
    user_id
  } = req.body

  if (!id || !name || !description || !avatar || !fun || !script) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  const editRes = await pluginModel.editPlugin(id, {
    id,
    name,
    description,
    avatar,
    variables,
    function: fun,
    script,
    status,
    user_id
  })
  res.json(httpBody(0, editRes))
})

export default router
