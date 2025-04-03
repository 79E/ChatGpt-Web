import { NextFunction, Response } from 'express'
import redis from '../helpers/redis'
import { httpBody } from '../utils'
import { ExpressRequest } from '../type'

const verifyPath = [
  'post:/api/login',
  'get:/api/send_sms',
  'get:/api/pay/notify',
  'post:/api/pay/notify',
  'get:/api/config',
  'get:/api/persona',
  'get:/api/images'
  //   'post:/api/upload'
]

// 校验
async function verify(req: ExpressRequest, res: Response, next: NextFunction) {
  const { token } = req.headers
  const { path, method } = req
  const filter = verifyPath.filter(
    (router) => router.toUpperCase() === `${method}:${path}`.toUpperCase()
  )

  const isToken = (!token || token === 'undefined' || token === 'null') ? false : true

  if ((filter.length || path.indexOf('/api') === -1) && !isToken) {
    await next()
    return
  }

  const redisTokenKey = `token:${token}`
  let tokenInfo: any = (await redis.select(1).get(redisTokenKey)) || null

  if (tokenInfo) {
    // 当前为前端用户登录
    try {
      tokenInfo = JSON.parse(tokenInfo)
    } catch (e) {
      redis.select(1).del(redisTokenKey)
      res.status(401).json(httpBody(4001, '用户token失效，请重新登录！'))
      return
    }
  } else {
    res.status(401).json(httpBody(4001, '请登录账户后重新尝试！'))
    return
  }

  // 在加一层是否访问的后端接口
  if (path.indexOf('/api/admin') !== -1 && tokenInfo?.role !== 'administrator') {
    res.status(403).json(httpBody(-1, '拒绝访问，请联系网站管理员！'))
    return
  }

  req.user_id = tokenInfo?.id
  next()
}
export default verify
