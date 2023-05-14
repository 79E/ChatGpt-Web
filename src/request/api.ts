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
