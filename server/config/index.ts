export type Config = {
  port: number
  mysql_config: {
    dialect: string
    host: string
    port: number
    username: string
    password: string
    database: string
    timezone: string
    dialectOptions: { [key: string]: any }
  }
  redis_config: {
    type: string
    host: string
    port: number
    auth_pass?: string
    password: string
  }
}

function getConfig(key?: keyof Config): any {
  const config: Config = {
    port: 3200,
    mysql_config: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'chatgpt-web',
      password: 'chatgpt-web',
      database: 'chatgpt-web',
      timezone: '+08:00',
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      }
    },
    redis_config: {
      type: 'redis',
      host: '127.0.0.1',
      port: 6379,
      password: 'chatgpt-web'
    },
  }

  if (key) {
    return config[key]
  }

  return config
}

export default {
  getConfig
}
