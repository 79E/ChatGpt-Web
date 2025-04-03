import express from 'express'
import redis from '../../helpers/redis'
import {
    configModel,
    aikeyModel,
    notificationModel,
    personaModel
} from '../../models'
import {
    generateCode,
    httpBody,
    getClientIP,
    distanceTime,
    generateUUID
} from '../../utils'
import { HttpBody } from '../../utils/httpBody'
import { sendMail } from '../../helpers/mailer'
import emailTemplate from '../../helpers/mailer/emailTemplate'
import { sendSms } from '../../helpers/sms'
import { ExpressRequest } from '../../type'

const router = express.Router()

// 获取配置信息
router.get('/config', async (req, res, next) => {
    const shop_introduce = await configModel.getConfigValue('shop_introduce')
    const user_introduce = await configModel.getConfigValue('user_introduce')
    const invite_introduce = await configModel.getConfigValue('invite_introduce')
    const website_title = await configModel.getConfigValue('website_title')
    const website_description = await configModel.getConfigValue('website_description')
    const website_keywords = await configModel.getConfigValue('website_keywords')
    const website_logo = await configModel.getConfigValue('website_logo')
    const website_footer = await configModel.getConfigValue('website_footer')
    const notification = await notificationModel.getNotification(
        { page: 0, page_size: 1000 },
        { status: 1 }
    )
    const notifications = notification.rows.sort((a: any, b: any) => {
        return a.sort - b.sort
    })

    const models = await aikeyModel.getAiKeyModels({})

    const random_personas = await personaModel.getRandomPersonas()
    res.json(
        httpBody(0, {
            shop_introduce,
            user_introduce,
            notifications: notifications,
            website_title,
            website_description,
            website_keywords,
            website_logo,
            website_footer,
            invite_introduce,
            random_personas,
            ...models
        })
    )
})

// 发送验证码
router.get('/send_sms', async (req, res, next) => {
    const source: string = Array.isArray(req.query.source)
        ? String(req.query.source[0])
        : String(req.query.source)

    const ip = getClientIP(req)

    const limitAny = async (value: string, prefix = 'code', number = 6) => {
        const KEY = `limit:${prefix}:${value}`
        const limitData = await redis.select().get(KEY)
        const time = distanceTime() || 1
        if (limitData && Number(limitData) >= number) {
            redis.select().expire(KEY, 60 * 60 * 24)
            return httpBody(-1, '请求次数过多，请稍后再试！')
        }
        if (limitData && Number(limitData) < number) {
            const value = Number(limitData) + 1
            redis.select().setex(KEY, value, time)
            return httpBody(0)
        }
        redis.select().setex(KEY, 1, time)
        return httpBody(0)
    }

    const limit = await limitAny(ip)
    if (limit.code) {
        res.json(limit)
        return
    }

    const code = await generateCode()
    let result: HttpBody | undefined

    const phoneRegex = /^1[3456789]\d{9}$/
    if (phoneRegex.test(source)) {
        let smsConfig: { [key: string]: string } = {}
        try {
            const smsConfigStr = (await configModel.getConfigValue('sms')) || ''
            smsConfig = JSON.parse(smsConfigStr)
        } catch (error) {
            res.json(httpBody(-1, '短信服务配置错误'))
            return
        }
        const { sign, template, password, user } = smsConfig
        const content = template.replace('{code}', code).replace('{time}', '10')
        result = await sendSms({
            user,
            password,
            content: `【${sign}】${content}`,
            phone: source
        })
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (emailRegex.test(source)) {
        let emailConfig: { [key: string]: string } = {}
        try {
            const emailConfigStr = (await configModel.getConfigValue('email')) || ''
            emailConfig = JSON.parse(emailConfigStr)
        } catch (error) {
            res.json(httpBody(-1, '邮件服务配置错误'))
            return
        }

        const { host, port, user, pass, subject, from_title } = emailConfig
        result = await sendMail({
            to: source,
            body: emailTemplate.code(code, from_title),
            subject,
            fromTitle: from_title,
            options: {
                host,
                port,
                auth: {
                    user,
                    pass
                }
            }
        })
    }

    if (result?.code) {
        res.json(result)
        return
    }

    await redis.select(0).setex(`code:${source}`, code, 600)
    res.json(httpBody(0, '发送成功'))
})

import upload from '../../helpers/upload'
import multer from 'multer'
const multerStorage = multer()
router.post('/upload', multerStorage.single('file'), async (req: ExpressRequest, res, next) => {
	const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '请重新登录后重试'))
        return
    }

	const file = req.file
    if(!file){
        res.json(httpBody(401, [], '缺少必要文件（file）'))
        return
    }
	const cloud_storage = await configModel.getConfigValue('cloud_storage')
	const json = cloud_storage ? JSON.parse(cloud_storage) : {}
    const data = await upload(file, {
        host: req.get('host'),
		...json
    }, { user_id })
	res.json(data)
})

export default router
