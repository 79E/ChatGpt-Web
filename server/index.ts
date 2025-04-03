import express from 'express'
import 'express-async-errors'
import path from 'path'
import cors from 'cors'
import routers from './routers'
import initDB from './models/db'
import config from './config'
import verify from './middlewares/verify'
import { globalScheduleJobs } from './helpers/schedule'
import catchError from './middlewares/catchError'

const app = express()

app.use(cors())

// 获取静态目录
app.use(express.static(path.join(__dirname, '../dist')))
app.use('/static/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.text({ type: 'text/plain' }));

// 校验Token
app.use(verify)

// 链接mysql
initDB()

// 初始化路由
routers(app)

// 系统级别的定时任务
globalScheduleJobs()

app.all('/api/*', (req, res) => {
  res
    .status(404)
    .json({ code: -1, data: [], message: 'The current access API address does not exist' })
})

// 渲染页面
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

// 错误处理
app.use(catchError)

// 启动服务器
const server = app.listen(config.getConfig('port'), () => {
  console.log(`Server is running on port ${config.getConfig('port')}`)
})
