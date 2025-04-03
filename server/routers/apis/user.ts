import express from 'express'
import redis from '../../helpers/redis'
import {
    carmiModel,
    configModel,
    messageModel,
    orderModel,
    paymentModel,
    productModel,
    signinModel,
    turnoverModel,
    userModel,
    actionModel,
    inviteRecordModel,
    cashbackModel,
    amountDetailsModel,
    withdrawalRecordModel,
    personaModel
} from '../../models'
import {
    httpBody,
    filterObjectNull,
    getClientIP,
    generateNowflakeId,
    generateToken,
    pagingData,
    generateMd5,
    generateUUID,
    generateCrc,
    getBrowserType,
} from '../../utils'
import { ExpressRequest } from '../../type'
import { formatTime } from '../../utils'
import { addCashbackQueue } from '../../helpers/queue'
import { yipay, alipay, jspay, hpjpay } from '../../helpers/pay'

const router = express.Router()

// 登录注册
router.post('/login', async (req, res, next) => {
    const { account, code, password, invite_code } = req.body
    const user_agent = req.headers['user-agent'] || ''
    const ip = getClientIP(req)

    if (!account || (!code && !password)) {
        res.status(406).json(httpBody(-1, '缺少必要参数'))
        return
    }

    let isSignin = true

    let userInfo = await userModel.getUserInfo({ account })

    const invite_reward = (await configModel.getConfigValue('invite_reward')) || 0
	const cashback_ratio = (await configModel.getConfigValue('cashback_ratio')) || 0
    const superiorInfo = await userModel.getUserInfo({ invite_code })

    const generateUserId = generateNowflakeId(1)()
    const generateInviteCode = generateCrc.crc32(`${generateUserId}_${Date.now()}`)

    if (account && code) {
        const redisCode = await redis.select(0).get(`code:${account}`)
        if (!redisCode) {
            res.status(406).json(httpBody(-1, '请先发送验证码'))
            return
        }
        if (code !== redisCode) {
            res.status(406).json(httpBody(-1, '验证码不正确'))
            return
        }
        await redis.select(0).del(`code:${account}`)
    }

    if (account && code && password && !userInfo) {
        // 三要素都存在 用户信息不存在 那么这是注册
        // 注册
        try {
            const today = new Date()
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
            const register_reward = (await configModel.getConfigValue('register_reward')) || 0
            userInfo = await userModel
                .addUserInfo(
                    filterObjectNull({
                        id: generateUserId,
                        account,
                        ip,
                        nickname: 'Chat用户',
                        avatar:
                            'https://u1.dl0.cn/icon/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
                        status: 1,
                        role: 'user',
                        password: generateMd5(password),
                        integral: Number(register_reward),
                        vip_expire_time: formatTime('yyyy-MM-dd HH:mm:ss', yesterday),
                        svip_expire_time: formatTime('yyyy-MM-dd HH:mm:ss', yesterday),
                        invite_code: generateInviteCode,
                        user_agent,
                        superior_id: superiorInfo ? superiorInfo.id : null,
						cashback_ratio
                    })
                )
                .then((addRes) => {
                    const turnoverId = generateNowflakeId(1)()
                    turnoverModel.addTurnover({
                        id: turnoverId,
                        user_id: generateUserId,
                        describe: '注册奖励',
                        value: `${register_reward}积分`
                    })

                    // 向邀请记录插入一条
                    if (invite_code && superiorInfo && superiorInfo.id) {
                        const inviteRecordId = generateNowflakeId(2)()
                        inviteRecordModel.addInviteRecord({
                            id: inviteRecordId,
                            user_id: generateUserId,
                            invite_code,
                            superior_id: superiorInfo.id,
                            reward: invite_reward,
                            reward_type: 'integral',
                            status: 3,
                            remark: '等待审核',
                            ip,
                            user_agent
                        })
                    }
                    return addRes
                })
            isSignin = false
            actionModel.addAction({
                id: generateNowflakeId(23)(),
                user_id: userInfo.id,
                ip,
                type: 'register',
                describe: '注册账号'
            })
        } catch (error) {
            console.log(error)
            res.status(500).json(httpBody(-1, '服务器错误'))
            return
        }
    } else if (!userInfo) {
        res.status(406).json(httpBody(-1, '用户不存在，请先注册账号'))
        return
    } else if (account && code && !password) {
        actionModel.addAction({
            id: generateNowflakeId(23)(),
            user_id: userInfo.id,
            ip,
            type: 'login_code',
            describe: '邮箱验证码登录'
        })
    } else if (account && password && !code) {
        const md5Password = generateMd5(password)
        if (userInfo.password !== md5Password) {
            res.status(406).json(httpBody(-1, '密码不正确'))
            return
        }
        actionModel.addAction({
            id: generateNowflakeId(23)(),
            user_id: userInfo.id,
            ip,
            type: 'login_password',
            describe: '账号密码登录'
        })
    } else {
        res.status(406).json(httpBody(-1, '数据异常'))
        return
    }

    const token = await generateToken(userInfo)

    const oldToken = (await redis.select(1).get(`user:${account}`)) || ''
    if (oldToken) {
        await redis.select(1).del(`token:${oldToken}`)
        await redis.select(1).del(`user:${account}`)
    }

    await redis.select(1).setex(`token:${token}`, JSON.stringify(userInfo), 2592000)
    await redis.select(1).setex(`user:${account}`, token, 2592000)

    if (isSignin) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const startTime = formatTime('yyyy-MM-dd HH:mm:ss', today)
        isSignin = await signinModel.getUserDaySignin(userInfo.id, startTime)
    }

    const updataUserInfo = {
        ip,
        user_agent
    }
    let inviteCode = userInfo?.invite_code || undefined
    if (!inviteCode) {
        inviteCode = generateInviteCode
        updataUserInfo['invite_code'] = generateInviteCode
    }
    await userModel.editUserInfo(userInfo.id, updataUserInfo)

    const user_id = userInfo.id
    const { invite_count } = await inviteRecordModel.getUserInviteCount(user_id)
    const { current_amount = 0 } = await amountDetailsModel.getAmountDetail({ user_id, status: 1 })
    const { pay_amount: subordinate_today_pay_amount } = await cashbackModel.getUserCashbackAmount(
        'pay_amount',
        {
            benefit_id: user_id
        }
    )
    const { commission_amount: all_commission_amount } = await cashbackModel.getUserCashbackAmount(
        'commission_amount',
        {
            benefit_id: user_id,
            status: 1
        },
        [new Date('2020-02-20'), new Date()]
    )

    res.json(
        httpBody(
            0,
            {
                user_info: {
                    ...userInfo,
                    ip,
                    user_agent,
                    today_invite_count: invite_count,
                    current_amount,
                    subordinate_today_pay_amount,
                    all_commission_amount,
                    invite_code: inviteCode,
                    is_signin: isSignin ? 1 : 0
                },
                token
            },
            '登录成功'
        )
    )
})

// 获取用户信息
router.get('/user/info', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }
    const userInfo = await userModel.getUserInfo({ id: user_id })
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startTime = formatTime('yyyy-MM-dd HH:mm:ss', today)
    const isSignin = await signinModel.getUserDaySignin(userInfo.id, startTime)

    const { invite_count } = await inviteRecordModel.getUserInviteCount(user_id)
    const { current_amount = 0 } = await amountDetailsModel.getAmountDetail({ user_id, status: 1 })
    const { pay_amount: subordinate_today_pay_amount } = await cashbackModel.getUserCashbackAmount(
        'pay_amount',
        {
            benefit_id: user_id
        }
    )
    const { commission_amount: all_commission_amount } = await cashbackModel.getUserCashbackAmount(
        'commission_amount',
        {
            benefit_id: user_id,
            status: 1
        },
        [new Date('2020-02-20'), new Date()]
    )
    res.status(200).json(
        httpBody(0, {
            ...userInfo,
            today_invite_count: invite_count,
            current_amount,
            subordinate_today_pay_amount,
            all_commission_amount,
            is_signin: isSignin ? 1 : 0
        })
    )
})

// 获取用户记录数据
router.get('/user/records', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '用户信息异常'))
        return
    }
    let data: {
        count: number
        rows: Array<any>
    } = {
        count: 0,
        rows: []
    }
    const { type } = req.query
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })

    if (type === 'invitation_records') {
        const inviteRecords = await inviteRecordModel.getInviteRecords(
            { page, page_size },
            { superior_id: user_id }
        )
        data = { ...inviteRecords }
    }

    if (type === 'consume_records') {
        const cashback = await cashbackModel.getCashback({ page, page_size }, { benefit_id: user_id })
        data = { ...cashback }
    }

    if (type === 'withdrawal_records') {
        const withdrawal = await withdrawalRecordModel.getWithdrawalRecords(
            { page, page_size },
            { user_id }
        )
        data = { ...withdrawal }
    }

    res.status(200).json(httpBody(0, data))
})

// 获取用户聊天记录
router.get('/user/messages', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '用户信息异常'))
        return
    }
    const chats = await messageModel.getUserMessages(user_id)
    res.status(200).json(httpBody(0, chats, '会话记录'))
})
// 删除会话数据
router.delete('/user/messages', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    const { parent_message_id } = req.query
    if (!user_id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    await messageModel.updateChats(filterObjectNull({ user_id, parent_message_id }))
    res.status(200).json(httpBody(0, [], '删除会话记录成功'))
})

// 修改用户密码
router.put('/user/password', async (req: ExpressRequest, res, next) => {
    const { account, code, password } = req.body
    if (!account || !code || !password) {
        res.status(406).json(httpBody(-1, '缺少必要参数'))
        return
    }

    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }

    const redisCode = await redis.select(0).get(`code:${account}`)
    if (code !== redisCode) {
        res.status(406).json(httpBody(-1, '验证码不正确'))
        return
    }
    await redis.select(0).del(`code:${account}`)

    const ip = getClientIP(req)
    await userModel.editUserInfo(user_id, {
        password: generateMd5(password),
        ip
    })

    actionModel.addAction({
        user_id,
        id: generateNowflakeId(23)(),
        ip,
        type: 'reset_password',
        describe: '重置密码密码'
    })

    res.status(200).json(httpBody(0, '重置密码成功'))
})

// 获取用户签到日历
router.get('/signin/list', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }
    const date = new Date()
    const start_time = formatTime(
        'yyyy-MM-dd HH:mm:ss',
        new Date(date.getFullYear(), date.getMonth(), 1)
    )
    const end_time = formatTime(
        'yyyy-MM-dd HH:mm:ss',
        new Date(date.getFullYear(), date.getMonth() + 1, 1)
    )

    const list = await signinModel.getUserSigninList(user_id, {
        start_time,
        end_time
    })

    res.status(200).json(httpBody(0, list))
})

// 获取角色数据
router.get('/persona', async (req: ExpressRequest, res, next) => {
    const allData = await personaModel.getAllPersona()
    res.json(httpBody(0, allData))
})

// 提交角色数据
router.post('/persona', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }
    const { title, context, description, avatar } = req.body
    if (!title || !context || !avatar) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const id = generateNowflakeId(1)()
    const addRes = await personaModel.addPersona(
        filterObjectNull({
            id,
            title,
            description,
            status: 4,
            user_id,
            context,
            avatar
        })
    )
    res.json(httpBody(0, addRes))
})

// 使用卡密
router.post('/use_carmi', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }
    const { carmi } = req.body
    const carmiInfo = await carmiModel
        .getCarmiInfo({
            key: carmi
        })
        .then((i) => i?.toJSON())
    if (!carmiInfo) {
        res.status(400).json(httpBody(-1, '卡密不存在'))
        return
    }
    if (carmiInfo.user_id || Number(carmiInfo.status) === 1) {
        res.status(500).json(httpBody(-1, '卡密已被使用'))
        return
    }
    if (Number(carmiInfo.status) === 2) {
        res.status(500).json(httpBody(-1, '卡密已过期'))
        return
    }
    const currentTime = new Date().setHours(0, 0, 0, 0)
    const endTime = Date.parse(carmiInfo.end_time)
    if (carmiInfo.end_time && endTime < currentTime) {
        res.status(500).json(httpBody(-1, '卡密已过期'))
        return
    }
    const ip = getClientIP(req)
    const useCarmi = await carmiModel.updateCarmiInfo(
        {
            user_id,
            status: 1,
            ip
        },
        {
            id: carmiInfo.id,
            key: carmi
        }
    )

    if (!useCarmi[0]) {
        res.status(500).json(httpBody(-1, '使用卡密失败，请稍后再试'))
        return
    }

    await actionModel.addAction({
        user_id,
        id: generateNowflakeId(23)(),
        ip,
        type: 'use_carmi',
        describe: '使用卡密'
    })
    // 开始增加到用户身上
    await userModel.updataUserVIP({
        id: user_id,
        value: carmiInfo.value,
        level: carmiInfo.level,
        type: carmiInfo.type,
        operate: 'increment'
    })

    const turnoverId = generateNowflakeId(1)()
    const levelMap = {
        1: '(会员)',
        2: '(超级会员)',
        default: '(积分)'
    }
    const typeText =
        carmiInfo.type === 'day' ? levelMap[carmiInfo.level] || '(天数)' : levelMap.default
    await turnoverModel.addTurnover({
        id: turnoverId,
        user_id,
        describe: `卡密充值 ${typeText}`,
        value: `${carmiInfo.value}${carmiInfo.type === 'day' ? '天' : '积分'}`
    })
    res.json(httpBody(0, '使用卡密成功'))
})

// 获取用户使用记录
router.get('/turnover', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const userTurnovers = await turnoverModel.getUserTurnovers(
        { page, page_size },
        {
            user_id
        }
    )
    res.json(httpBody(0, userTurnovers))
})

// 签到
router.post('/signin', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startTime = formatTime('yyyy-MM-dd HH:mm:ss', today)
    const isSignin = await signinModel.getUserDaySignin(user_id, startTime)
    if (isSignin) {
        res.status(500).json(httpBody(-1, '今日已经签到了'))
        return
    }

    const signin_reward = (await configModel.getConfigValue('signin_reward')) || 0
    const ip = getClientIP(req)
    const id = generateNowflakeId(1)()
    const turnoverId = generateNowflakeId(1)()

    actionModel.addAction({
        user_id,
        id: generateNowflakeId(23)(),
        ip,
        type: 'signin',
        describe: '签到'
    })

    await signinModel.addSignin({
        id,
        user_id,
        ip
    })
    await userModel.updataUserVIP({
        id: user_id,
        value: Number(signin_reward),
        type: 'integral',
        operate: 'increment'
    })
    await turnoverModel.addTurnover({
        id: turnoverId,
        user_id,
        describe: '签到奖励',
        value: `${signin_reward}积分`
    })

    res.json(httpBody(0, `签到成功 +${signin_reward}积分`))
})

// 获取商品
router.get('/product', async (req, res, next) => {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: 1000
    })
    const products = await productModel.getProducts(
        {
            page,
            page_size
        },
        {
            status: 1
        }
    )
    const pay_types = await paymentModel.getPaymentTypes()
    const rows = products.rows.sort((a: any, b: any) => {
        return a.sort - b.sort
    })
    res.json(
        httpBody(0, {
            products: rows,
            pay_types
        })
    )
})

// 申请提现
router.post('/user/withdrawal', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '用户信息异常'))
        return
    }
    const withdrawal3 = await withdrawalRecordModel.getWithdrawalRecord({
        user_id,
        status: 3
    })
    if (withdrawal3) {
        res.status(500).json(httpBody(-1, '已提交提现申请，请耐心等待'))
        return
    }

    const user_agent = req.headers['user-agent'] || ''
    const ip = getClientIP(req)

    const userAmountDetails = await amountDetailsModel.getAmountDetail({
        user_id: user_id,
        status: 1
    })
    if (
        !userAmountDetails ||
        !userAmountDetails?.current_amount ||
        userAmountDetails?.current_amount <= 0
    ) {
        res.status(500).json(httpBody(-1, '账户不存在或余额不足'))
        return
    }
    const withdrawalId = generateNowflakeId(1)()
    const amountDetailId = generateNowflakeId(1)()
    const insertData = {
        id: amountDetailId,
        status: 1,
        user_id,
        type: 'withdrawal',
        correlation_id: withdrawalId,
        operate_amount: userAmountDetails?.current_amount,
        current_amount: 0,
        remarks: '申请提现',
        original_amount: userAmountDetails?.original_amount
    }
    await amountDetailsModel.addAmountDetails(insertData)
    const { name, account, contact, message, type } = req.body

    await withdrawalRecordModel.addWithdrawalRecord({
        id: withdrawalId,
        user_id,
        name,
        account,
        contact,
        message,
        type,
        status: 3,
        remarks: '等待审核',
        amount: userAmountDetails?.current_amount,
        ip,
        user_agent
    })

    res.status(200).json(httpBody(0, '申请提现成功'))
})

// 创建支付订单
router.post('/pay/precreate', async (req: ExpressRequest, res, next) => {
    const user_id = req?.user_id
    if (!user_id) {
        res.status(500).json(httpBody(-1, '服务端错误'))
        return
    }

    const { quantity = 1, pay_type, product_id } = req.body

    if (!pay_type || !product_id) {
        res.status(406).json(httpBody(-1, '缺少必要参数'))
        return
    }

    // 获取商品信息
    const productInfo = await productModel.getProduct(product_id)
    if (!productInfo) {
        res.status(406).json(httpBody(-1, '商品不存在'))
        return
    }

    // 获取支付信息
    const paymentInfo = await paymentModel.getOnePayment(pay_type)
    if (!paymentInfo) {
        res.status(406).json(httpBody(-1, '支付信息未配置'))
        return
    }
    const user_agent = req.headers['user-agent'] || ''
    const device = getBrowserType(user_agent)

    const out_trade_no = generateNowflakeId(1)()
    const responseData = {
        channel: paymentInfo.channel,
        order_id: out_trade_no,
        pay_url: '',
        pay_type
    }

    const ip = getClientIP(req)

    // const getServerUrl = () => {
    //   const host = req.get('host') || ''
    //   if (host.includes(':443')) {
    //     return `https://${host.split(':')[0]}`
    //   }
    //   return `${req.protocol}://${host.split(':')[0]}`
    // }

    const notifyUrl = `https://${req.get('host')?.split(':')[0]}/api/pay/notify?channel=${paymentInfo.channel
        }`

    const amount = productInfo.price / 100
    const paymentParams = JSON.parse(paymentInfo.params)

    const paramsStringify = JSON.stringify({
        order_id: out_trade_no,
        product_id,
        user_id,
        payment_id: paymentInfo.id
    })

    actionModel.addAction({
        user_id,
        id: generateNowflakeId(23)(),
        ip,
        type: 'pay_order',
        describe: '创建支付订单'
    })

    if (paymentInfo.channel === 'alipay') {
        const alipayPrecreate = await alipay.precreate({
            config: paymentParams,
            notify_url: notifyUrl,
            out_trade_no,
            total_amount: amount,
            subject: productInfo.title,
            body: paramsStringify,
            goods_detail: {
                goods_id: productInfo.id,
                goods_name: productInfo.title,
                price: amount,
                quantity
            }
        })
        if (alipayPrecreate.code) {
            res.status(500).json(httpBody(-1, '支付错误，稍后再试'))
            return
        }
        responseData.order_id = alipayPrecreate.outTradeNo
        responseData.pay_url = alipayPrecreate.qrCode
    }

    if (paymentInfo.channel === 'yipay') {
        const yipayPrecreate = await yipay.precreate(
            {
                api: paymentParams.api,
                key: paymentParams.key
            },
            {
                pid: Number(paymentParams.pid),
                return_url: paymentParams?.return_url
            },
            {
                type: pay_type,
                out_trade_no,
                notify_url: notifyUrl,
                name: productInfo.title,
                money: amount,
                clientip: ip,
                device,
                param: encodeURIComponent(paramsStringify)
            }
        )
        if (yipayPrecreate.code) {
            res.status(500).json(httpBody(-1, `支付错误：${yipayPrecreate.msg}`))
            return
        }
        responseData.pay_url = yipayPrecreate.pay_url
    }

    if (paymentInfo.channel === 'jspay') {
        const jspayPrecreate = await jspay.precreate(
            {
                api: paymentParams.api,
                key: paymentParams.key
            },
            {
                mchid: paymentParams.mchid,
                total_fee: amount * 100,
                out_trade_no,
                body: productInfo.title,
                notify_url: notifyUrl,
                type: pay_type,
                attach: paramsStringify
            }
        )
        if (jspayPrecreate.code) {
            res.status(500).json(httpBody(-1, '支付错误，稍后再试'))
            return
        }
        responseData.pay_url = jspayPrecreate.qrcode
    }

    if (paymentInfo.channel === 'hpjpay') {
        const hpjpayPrecreate = await hpjpay.precreate(
            {
                api: paymentParams.api,
                key: paymentParams.key
            },
            {
                version: '1.1',
                appid: paymentParams.appid,
                total_fee: amount,
                trade_order_id: out_trade_no,
                title: productInfo.title,
                notify_url: notifyUrl,
                type: pay_type === 'wxpay' ? 'WAP' : pay_type,
                attach: paramsStringify,
                return_url: productInfo?.return_url,
                nonce_str: generateUUID() + Date.now(),
                time: Date.now(),
                wap_url: productInfo?.return_url || 'ChatGptAI',
                wap_name: 'ChatGptAI'
            }
        )
        if (hpjpayPrecreate.code) {
            res.status(500).json(httpBody(-1, '支付错误，稍后再试'))
            return
        }
        responseData.pay_url = hpjpayPrecreate.pay_url
    }

    await orderModel.addOrder({
        id: out_trade_no,
        pay_type,
        product_title: productInfo.title,
        product_id,
        trade_status: 'WAIT_BUYER_PAY', // 等待支付
        user_id,
        product_info: JSON.stringify(productInfo),
        channel: paymentInfo.channel,
        payment_id: paymentInfo.id,
        payment_info: JSON.stringify(paymentInfo),
        money: amount,
        params: paramsStringify,
        ip,
        pay_url: responseData.pay_url
    })

    res.json(httpBody(0, responseData))
})

// 支付通知
router.all('/pay/notify', async (req: ExpressRequest, res, next) => {
    const checkNotifySign = async (payment_id, data, channel) => {
        const paymentInfo = await paymentModel.getPaymentInfo(payment_id)
        if (!paymentInfo) {
            return false
        }
        const config = JSON.parse(paymentInfo.params)
        if (channel === 'alipay') {
            const isCheck = await alipay.checkNotifySign(config, data)
            if (!isCheck) {
                return false
            }
        }

        if (channel === 'yipay') {
            const isCheck = await yipay.checkNotifySign(data, config.key)
            if (!isCheck) {
                return false
            }
        }

        if (channel === 'jspay') {
            const isCheck = await jspay.checkNotifySign(data, config.key)
            if (!isCheck) {
                return false
            }
        }

        if (channel === 'hpjpay') {
            const isCheck = await hpjpay.checkNotifySign(data, config.key)
            if (!isCheck) {
                return false
            }
        }

        return true
    }

    const batchModify = async ({
        order_id,
        trade_status,
        trade_no,
        notify_info,
        user_id,
        product_id
    }) => {
        // 新增用户余额
        const addQuotaInfo = await userModel.addUserProductQuota(user_id, product_id)
        if (addQuotaInfo.code) {
            return false
        }
        // 修改订单信息
        await orderModel.editOrder({
            id: order_id,
            trade_status,
            trade_no,
            notify_info
        })
        // 加个账单
        const turnoverId = generateNowflakeId(1)()
        await turnoverModel.addTurnover({
            id: turnoverId,
            user_id,
            describe: `购买-${addQuotaInfo.data?.title}`,
            value: addQuotaInfo.data?.value
        })
        await addCashbackQueue.addTask({
            user_id,
            order_id,
            trade_no,
            product_id
        })
        return true
    }

    try {
        if (req.body?.channel && req.body?.channel === 'alipay') {
            const { body, out_trade_no, trade_status, trade_no } = req.body
            const orderInfo = await orderModel.getOrderInfo(out_trade_no)
            if (!orderInfo || orderInfo.trade_status !== 'WAIT_BUYER_PAY') {
                res.status(404).json('fail')
                return
            }
            const { payment_id, user_id, product_id } = JSON.parse(body)
            const isCheck = await checkNotifySign(payment_id, req.body, req.body?.channel)
            if (!isCheck) {
                res.status(404).json('fail')
                return
            }
            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status,
                trade_no,
                notify_info: JSON.stringify(req.body),
                user_id,
                product_id
            })
            if (!modifyResult) {
                res.status(404).json('fail')
                return
            }
        }

        if (req.query?.channel && req.query?.channel === 'yipay') {
            const { out_trade_no, trade_status, trade_no } = req.query
            const orderInfo = await orderModel.getOrderInfo(out_trade_no)
            if (!orderInfo || orderInfo.trade_status !== 'WAIT_BUYER_PAY') {
                res.status(404).json('fail')
                return
            }

            const { payment_id, user_id, product_id } = JSON.parse(
                decodeURIComponent(req.query?.param as string)
            )
            const isCheck = await checkNotifySign(payment_id, req.query, req.query?.channel)
            if (!isCheck) {
                res.status(404).json('fail')
                return
            }

            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status,
                trade_no,
                notify_info: JSON.stringify(req.query),
                user_id,
                product_id
            })

            if (!modifyResult) {
                res.status(404).json('fail')
                return
            }
        }

        if (req.query?.channel && req.query?.channel === 'jspay') {
            const { attach, return_code, out_trade_no, trade_no } = req.body
            if (Number(return_code) !== 1) {
                res.status(404).json('fail')
                return
            }
            const orderInfo = await orderModel.getOrderInfo(out_trade_no)
            if (!orderInfo || orderInfo.trade_status !== 'WAIT_BUYER_PAY') {
                res.status(404).json('fail')
                return
            }
            const { payment_id, user_id, product_id } = JSON.parse(attach)
            const isCheck = await checkNotifySign(payment_id, req.body, req.query?.channel)
            if (!isCheck) {
                res.status(404).json('fail')
                return
            }
            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status: Number(return_code) === 1 ? 'TRADE_SUCCESS' : 'WAIT_BUYER_PAY',
                trade_no,
                notify_info: JSON.stringify(req.body),
                user_id,
                product_id
            })
            if (!modifyResult) {
                res.status(404).json('fail')
                return
            }
        }

        if (req.query?.channel && req.query?.channel === 'hpjpay') {
            const { attach, status, trade_order_id: out_trade_no, open_order_id: trade_no } = req.body
            if (status !== 'OD') {
                res.status(404).json('fail')
                return
            }
            const orderInfo = await orderModel.getOrderInfo(out_trade_no)
            if (!orderInfo || orderInfo.trade_status !== 'WAIT_BUYER_PAY') {
                res.status(404).json('fail')
                return
            }
            const { payment_id, user_id, product_id } = JSON.parse(attach)
            const isCheck = await checkNotifySign(payment_id, req.body, req.query?.channel)
            if (!isCheck) {
                res.status(404).json('fail')
                return
            }
            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status: status !== 'OD' ? 'TRADE_SUCCESS' : 'WAIT_BUYER_PAY',
                trade_no,
                notify_info: JSON.stringify(req.body),
                user_id,
                product_id
            })
            if (!modifyResult) {
                res.status(404).json('fail')
                return
            }
        }
    } catch (error) {
        console.log(error)
        res.status(404).json('fail')
        return
    }

    res.json('success')
})

export default router
