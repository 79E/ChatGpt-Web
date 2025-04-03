import express from 'express'
import { ExpressRequest } from '../../type'
import redis from '../../helpers/redis'
import { configModel, installedPluginModel, pluginModel } from '../../models'
import { generateNowflakeId, httpBody } from '../../utils'

const router = express.Router()

// 获取插件
router.get('/plugin', async (req: ExpressRequest, res, next) => {
  const user_id = req?.user_id
  let finds = await pluginModel.getUserPluginAll(
    user_id
  )

  if(user_id){
    const promiseList = finds.map(async (item)=>{
      const installed = await installedPluginModel.getInstalledPluginLog({
        user_id,
        plugin_id: item.id,
        status: 1
      })
      return {
        ...item,
        installed: !!installed
      }
    })
    finds = (await Promise.all(promiseList)).map(item => item)
  }

  res.json(httpBody(0, finds))
})

// 创建插件
router.post('/plugin', async (req, res, next) => {
  res.json(httpBody(0, '发送成功'))
})

// 安装
router.put('/plugin/installed/:id', async (req: ExpressRequest, res, next) => {
  const { id } = req.params
  const user_id = req?.user_id
  if (!id || !user_id) {
      res.json(httpBody(-1, '缺少必要参数'))
      return
  }

  const is = await installedPluginModel.getInstalledPluginLog({
    user_id,
    plugin_id: id,
    status: 1
  })

  if(is){
    res.json(httpBody(0, '安装成功'))
    return
  }

  await installedPluginModel.addInstalledPlugin({
    user_id,
    plugin_id: id,
    status: 1
  })
  res.json(httpBody(0, '安装成功'))
})

// 卸载
router.put('/plugin/uninstall/:id', async (req: ExpressRequest, res, next) => {
  const { id } = req.params
  const user_id = req?.user_id
  if (!id || !user_id) {
      res.json(httpBody(-1, '缺少必要参数'))
      return
  }

  await installedPluginModel.editInstalledPlugin({
    status: 0
  }, {
    user_id,
    plugin_id: id,
    status: 1
  })

  res.json(httpBody(0, '操作成功'))
})

export default router
