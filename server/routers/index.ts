import { Express } from 'express'
import apis from './apis'
import adminRouters from './admin'

export default (app: Express) => {
  // 前端用户用的一些接口
  app.use('/api', [...apis])
  // 管理后台用的一些接口
  app.use('/api/admin', [...adminRouters])

  return app
}
