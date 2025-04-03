import sequelize, { Sequelize } from 'sequelize'
import config from '../config'

const sequelizeExample = new Sequelize({
  ...config.getConfig('mysql_config'),
  logging: (sql: string, timing?: number) => {
    console.log(sql)
  }
})

const initMysql = async () => {
  try {
    await sequelizeExample.authenticate()
    console.log('MySQL database connection succeeded.')
  } catch (error) {
    console.log(`MySQL database link error: ${error}`)
  }

  return sequelizeExample
}

const initDB = async () => {
  await initMysql()
}

export { sequelize, sequelizeExample }
export default initDB
