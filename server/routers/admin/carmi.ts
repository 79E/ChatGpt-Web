import express from 'express'
import { formatTime, generateMd5, generateNowflakeId, generateUUID, httpBody, pagingData } from '../../utils'
import { carmiModel } from '../../models'
const router = express.Router()

// 获取卡密列表
router.get('/carmi', async function (req, res, next) {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const carmis = await carmiModel.getCarmis({ page, page_size })
  res.json(httpBody(0, carmis))
})

router.delete('/carmi/:id', async function (req, res, next) {
  const { id } = req.params
  if (!id) {
    res.json(httpBody(-1, '缺少必要参数'))
    return
  }
  // 删除卡密
  const delRes = await carmiModel.delCarmi(id)
  res.json(httpBody(0, delRes))
})

// 生成卡密
router.post('/carmi', async function (req, res, next) {
  const {
    type = 'integral',
    end_time = '',
    quantity = 1,
    reward = 10,
    level = 1
  } = req.body

  const generateCarmi = (q: number) => {
    const keys: Array<string> = []
    for (let i = 0; i < q; i++) {
      const str = `${generateUUID()}_${generateNowflakeId(i + 1)()}_${new Date().getTime()}`
      const key = generateMd5(str);
      keys.push(key)
    }
    return keys;
  }
  const carmis = generateCarmi(quantity);
  const insertData = carmis.map((carmi, index) => {
    const id = generateNowflakeId(index)()
    return {
      id,
      key: carmi,
      type,
      end_time,
      value: reward,
      status: 0,
      level
    }
  })
  // 批量添加卡密
  const addRes = await carmiModel.addCarmis(insertData)
  res.json(httpBody(0, addRes))
})

router.get('/carmi/check', async function (req, res, next) {
  const time = formatTime('yyyy-MM-dd')
  carmiModel.checkCarmiEndTime(time);
  res.json(httpBody(0))
})


export default router
