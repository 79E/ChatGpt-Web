import express from 'express'
import multer from 'multer'
import {
  configModel,
  aikeyModel,
  turnoverModel,
  userModel,
  actionModel,
  drawRecordModel
} from '../../models'
import draw from '../../helpers/draw'
import textModeration from '../../helpers/textModeration'
import {
  httpBody,
  getClientIP,
  generateNowflakeId,
  dataURItoFile,
  filterObjectNull,
  formatTime,
  pagingData,
  checkProhibitedWords
} from '../../utils'
import { ExpressRequest } from '../../type'
import { HttpBody } from '../../utils/httpBody'
import upload from '../../helpers/upload'

const multerStorage = multer({ storage: multer.memoryStorage() })

const router = express.Router()

// 绘画
router.post('/images/generations', multerStorage.any(), async (req: ExpressRequest, res, next) => {
  const startTime = new Date().getTime()
  const user_id = req?.user_id
  if (!user_id) {
    res.status(500).json(httpBody(-1, '服务端错误'))
    return
  }
  const { draw_type, quantity, width, prompt, model } = req.body

  const userInfo = await userModel.getUserInfo({
    id: user_id
  })

  const cloudStorage = await configModel.getConfigValue('cloud_storage')
  const cloudStorageJson = cloudStorage ? JSON.parse(cloudStorage) : {}
  const reqFile = req.files?.[0] || ''
  let uploadFileInfo: { [key: string]: any } | null = null
  if (reqFile) {
    const uploadResult = await upload(
      reqFile,
      {
        host: req.get('host'),
        ...cloudStorageJson
      },
      { user_id }
    )

    if (!uploadResult.code) {
      uploadFileInfo = { ...uploadResult.data }
    }
  }

  const ip = getClientIP(req)

  const drawPrice: number | string =
    (await configModel.getConfigValue('draw_price').then((res) => {
      return res?.toString()
    })) || 0

  const baseDrawIntegral = Number(drawPrice) * 7

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const vipExpireTime = new Date(userInfo.vip_expire_time).getTime()
  if (!(userInfo.integral > baseDrawIntegral || vipExpireTime >= todayTime)) {
    res
      .status(400)
      .json(httpBody(-1, [], `当前账户积分余额不足，绘画最低消耗${baseDrawIntegral}积分`))
    return
  }

  const svipExpireTime = new Date(userInfo.svip_expire_time).getTime()
  if (svipExpireTime < todayTime && userInfo.integral <= baseDrawIntegral) {
    res.status(400).json(httpBody(-1, [], '当前账户积分不足或不是超级会员无法使用SD绘画'))
    return
  }

  // 内容审核
  const tuputech_key = await configModel.getConfigValue('tuputech_key')
  const prohibited_words = await configModel.getConfigValue('prohibited_words')
  if (tuputech_key) {
    const { action, details } = await textModeration.tuputech(tuputech_key, prompt)
    const matchedWords = Array.isArray(details) ? details?.map((item) => item.hint) : []
    if (action !== 'pass') {
      res
        .status(500)
        .json(
          httpBody(
            -1,
            `很抱歉，您发送的内容违反了我们的规定，请修改后重新尝试。涉及敏感词：\`${matchedWords.join(
              '`、`'
            )}\``
          )
        )
      return
    }
  } else if (prohibited_words) {
    const { action, matchedWords = [] } = await checkProhibitedWords(prompt, prohibited_words)
    if (action !== 'pass') {
      res
        .status(500)
        .json(
          httpBody(
            -1,
            `很抱歉，您发送的内容违反了我们的规定，请修改后重新尝试。涉及敏感词：\`${matchedWords.join(
              '`、`'
            )}\``
          )
        )
      return
    }
  }

  let generations: HttpBody<{ [key: string]: any }[]> = httpBody(-1, [], '生成失败')
  if (draw_type === 'openai') {
    const aikeyInfo = await aikeyModel.getOneAikey({ model, type: 'openai-draw' })
    if (!aikeyInfo || !aikeyInfo.id) {
      res.status(500).json(httpBody(-1, '未配置对应模型'))
      return
    }
    const sizes = [256, 512, 1024]
    let size = '256x256'
    if (sizes.includes(Number(width))) {
      size = `${width}x${width}`
    }
    generations = await draw.openAi({
      prompt,
      size,
      n: quantity,
      aikeyInfo
    })
  }

  if (draw_type === 'stability') {
    const aikeyInfo = await aikeyModel.getOneAikey({ model, type: 'stability-draw' })
    if (!aikeyInfo || !aikeyInfo.id) {
      res.status(500).json(httpBody(-1, '未配置对应模型'))
      return
    }

    generations = await draw.stability({
      request: {
        prompt,
        width,
        height: req.body.height,
        samples: req.body.quantity,
        cfg_scale: req.body.quality,
        style_preset: req.body.style,
        steps: req.body.steps,
		model,
        init_image: uploadFileInfo?.buffer || ''
      },
      aikeyInfo
    })
  }

  if (draw_type === 'stablediffusion') {
    const aikeyInfo = await aikeyModel.getOneAikey({ model, type: 'stablediffusion-draw' })
    if (!aikeyInfo || !aikeyInfo.id) {
      res.status(500).json(httpBody(-1, '未配置对应模型'))
      return
    }

    generations = await draw.stablediffusion({
      request: {
        prompt,
        width,
        height: req.body.height,
        samples: req.body.quantity,
        guidance_scale: req.body.quality,
		model,
        init_image: uploadFileInfo?.url || ''
      },
      aikeyInfo
    })
  }

  if (generations.code || !generations.data) {
    res.status(500).json(generations)
    return
  }

  const newlist: Array<any> = []
  for (const item of generations.data) {
    const fileObject = dataURItoFile(item?.url)
    const generationsUpload = await upload(
      fileObject,
      {
        host: '//' + req.get('host'),
        ...cloudStorageJson
      },
      {
        user_id
      }
    )
    newlist.push({
      ...generationsUpload.data
    })
  }

  if (newlist.length > 0) {
    const drawRecordId = generateNowflakeId(1)()
    generations.data = [
      {
        id: drawRecordId,
        user_id,
        inset_image_url: uploadFileInfo?.url,
        images: newlist.map((item) => item.url),
        prompt,
        size: req.body.height ? `${width}x${req.body.height}` : `${width}x${width}`,
        status: 4,
        take_time: Math.ceil((new Date().getTime() - startTime) / 1000),
        model: draw_type,
        create_time: formatTime()
      }
    ]
    await drawRecordModel.addDrawRecord({
      id: drawRecordId,
      user_id,
      inset_image_url: uploadFileInfo?.url,
      images: JSON.stringify(newlist.map((item) => item.url)),
      prompt,
      size: req.body.height ? `${width}x${req.body.height}` : `${width}x${width}`,
      status: 4,
      take_time: Math.ceil((new Date().getTime() - startTime) / 1000),
      model: draw_type,
      params: JSON.stringify(
        filterObjectNull({
          ...req.body,
          image: null
        })
      )
    })
  }

  //   generations.data = [...newlist]

  const endTime = new Date().getTime()
  const deductIntegral = Math.ceil((endTime - startTime) / 1000) * Math.ceil(Number(drawPrice))

  if (vipExpireTime < todayTime) {
    userModel.updataUserVIP({
      id: user_id,
      type: 'integral',
      value: deductIntegral,
      operate: 'decrement'
    })
    const turnoverId = generateNowflakeId(1)()
    turnoverModel.addTurnover({
      id: turnoverId,
      user_id,
      describe: '绘画',
      value: `-${deductIntegral}积分`
    })
  }
  actionModel.addAction({
    user_id,
    id: generateNowflakeId(23)(),
    ip,
    type: 'draw',
    describe: '绘画'
  })

  res.json(generations)
})

// 获取绘画列表
router.get('/images', async (req: ExpressRequest, res, next) => {
  const { page, page_size } = pagingData({
    page: req.query.page,
    page_size: req.query.page_size
  })
  const { type = 'gallery' } = req.query

  const user_id = req?.user_id
  if (type === 'me' && !user_id) {
    res.status(401).json(httpBody(4001, '请登陆后重试！'))
    return
  }

  const result = await drawRecordModel.getDrawRecord({
    page,
    page_size,
    type,
    user_id
  })

  res.json(httpBody(0, result))
})

// 修改绘画状态
router.put('/images', async (req: ExpressRequest, res, next) => {
  const { id, status = 0 } = req.body

  const user_id = req?.user_id
  if (!user_id) {
    res.status(401).json(httpBody(4001, '请登陆后重试！'))
    return
  }

  await drawRecordModel.setDrawRecord({
    status,
    id,
    user_id
  })

  res.json(httpBody(0, '清理成功'))
})

export default router
