import {
  ProductInfo,
  RequesPrepay,
  RequestChatOptions,
  RequestImagesGenerations,
  RequestLoginParams,
  RequestOpenChatOptions,
  ResponseLoginData,
  SubscriptionInfo,
  UserDetail
} from '@/types'
import request from '.'
import { formatTime } from '@/utils'

// 获取验证码
export function getCode(params: Omit<RequestLoginParams, 'code'>) {
  return request.get('/send_sms', params)
}

// 登陆
export function postLogin(params: RequestLoginParams) {
  return request.post<ResponseLoginData>('/login', params)
}

// 获取用户信息
export function getUserInfo() {
  return request.get<UserDetail>('/user/info')
}

// 请求对话
export function postCompletions(
  params: RequestChatOptions,
  config?: {
    headers?: { [key: string]: any }
    options?: { [key: string]: any }
  }
) {
  return request.postStreams<Response>('/completions', params, config)
}

// 直接请求三方 直链
export function postChatCompletions(
  url: string,
  params: RequestOpenChatOptions,
  config?: {
    headers?: { [key: string]: any }
    options?: { [key: string]: any }
  }
) {
  return request.postStreams<Response>(
    `${url}/v1/chat/completions`,
    { ...params, stream: true },
    config
  )
}

// 请求三方直接链接 绘画
export function postApiImagesGenerations(
  url: string,
  params: RequestImagesGenerations,
  headers?: { [key: string]: any },
  options?: { [key: string]: any }
) {
  return request.post<Array<{ url: string }>>(
    `${url}/v1/images/generations`,
    { ...params },
    headers,
    options
  )
}

// 请求三方直接链接 绘画
export function postImagesGenerations(
  params: RequestImagesGenerations,
  headers?: { [key: string]: any },
  options?: { [key: string]: any }
) {
  return request.post<Array<{ url: string }>>(
    '/images/generations',
    { ...params },
    headers,
    options
  )
}

// 获取Key余额
export async function getKeyUsage(url: string, key: string) {
  if (!url || !key) return 0
  const subscriptionUrl = `${url}/dashboard/billing/subscription`

  const subscriptionRes = await request.get<SubscriptionInfo>(
    subscriptionUrl,
    {},
    {
      Authorization: 'Bearer ' + key
    }
  )

  let remaining = subscriptionRes?.data?.hard_limit_usd || 0
  const now = new Date()
  const usageUrl = `${url}/dashboard/billing/usage`
  let startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const subDate = new Date(now)
  subDate.setDate(1)

  if (remaining > 20) {
    startDate = subDate
  }

  if (subscriptionRes?.data?.has_payment_method) {
    const day = now.getDate() // 本月过去的天数
    startDate = new Date(now.getTime() - (day - 1) * 24 * 60 * 60 * 1000) // 本月第一天
  }

  const usageres = await request.get<{ total_usage: number }>(
    usageUrl,
    {
      start_date: formatTime('yyyy-MM-dd', new Date(startDate)),
      end_date: formatTime('yyyy-MM-dd', new Date(endDate))
    },
    {
      Authorization: 'Bearer ' + key
    }
  )

  if (!usageres.code) {
    remaining -= usageres.data.total_usage / 100
  }

  return remaining.toFixed(2)
}

// 获取商品列表
export function getProduct() {
  return request.get<Array<ProductInfo>>('/product')
}

// 获取用户消费记录
export function getIntegralLogs(params: { page: number; pageSize: number }) {
  return request.get('/integral_logs', params)
}

// 提交订单
export function postPrepay(params: RequesPrepay) {
  return request.post<{
    order_sn: string
    payurl: string
    qrcode: string
  }>('/prepay', params)
}

// 卡密充值
