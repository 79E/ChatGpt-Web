import Ioioredis, { RedisKey, Redis as Ioredis } from 'ioredis'
import config from '../../config'

const ioredis = new Ioioredis({
  ...config.getConfig('redis_config')
})

class Redis {
  ioredis: Ioredis
  constructor(ioredis: Ioioredis) {
    this.ioredis = ioredis
    this.select(0)
  }
  select(index = 0) {
    this.ioredis.select(index)
    return this
  }
  // 秒
  expire(key: RedisKey, time = 0) {
    if (time) {
      ioredis.expire(key, time)
    }
    return this
  }
  // 毫秒
  pexpire(key: RedisKey, time = 0) {
    if (time) {
      ioredis.pexpire(key, time)
    }
    return this
  }
  async get(key: RedisKey) {
    const results = await ioredis.get(key)
    return results
  }
  set(key: RedisKey, value: string | number) {
    ioredis.set(key, value)
    return this
  }
  setex(key: RedisKey, value: string | number, time: number) {
    ioredis.setex(key, time, value)
    return this
  }
  sadd(key: RedisKey, value: string | number, time?: number) {
    ioredis.sadd(key, value)
    if (time) {
      ioredis.expire(key, time)
    }
    return this
  }
  // 删除集合中某个数据
  srem(key: RedisKey, value: string) {
    return ioredis.srem(key, value)
  }
  sismember(key: RedisKey, value: string | number) {
    return ioredis.sismember(key, value)
  }
  smembers(key: RedisKey) {
    return ioredis.smembers(key)
  }
  async del(...args: RedisKey[]) {
    const results = await ioredis.del(args)
    return results
  }
}

export default new Redis(ioredis)
