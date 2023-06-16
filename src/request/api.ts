import {
  ConsumeRecordInfo,
  InvitationRecordInfo,
  ProductInfo,
  RequesPrepay,
  RequestChatOptions,
  RequestImagesGenerations,
  RequestLoginParams,
  ResponseConfigData,
  ResponseLoginData,
  SigninInfo,
  SubscriptionInfo,
  TurnoverInfo,
  UserInfo,
  WithdrawalRecordInfo
} from '@/types'
import request from '.'
import { formatTime } from '@/utils'
import { TableData } from '@/types/admin'

// 获取验证码
export function getCode(params: { source: string }) {
  return request.get('/api/send_sms', params)
}

// 登陆
export function postLogin(params: RequestLoginParams) {
  return request.post<ResponseLoginData>('/api/login', params)
}

// 获取用户信息
export function getUserInfo() {
  return request.get<UserInfo>('/api/user/info')
}

// 请求对话
export function postChatCompletions(
  params: RequestChatOptions,
  config?: {
    headers?: { [key: string]: any }
    options?: { [key: string]: any }
  }
) {
  return request.postStreams<Response>('/api/chat/completions', params, config)
}

// 请求绘画
export function postImagesGenerations(
  params: RequestImagesGenerations,
  headers?: { [key: string]: any },
  options?: { [key: string]: any }
) {
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key])
  })
  return request.post<Array<{ url: string }>>(
    '/api/images/generations',
    formData,
    {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    options
  )
}

// 获取商品列表
export function getProduct() {
  return request.get<{
    products: Array<ProductInfo>
    pay_types: Array<string>
  }>('/api/product')
}

// 获取用户消费记录
export function getUserTurnover(params: { page: number; page_size: number }) {
  return request.get<{ count: number; rows: Array<TurnoverInfo> }>('/api/turnover', params)
}

// 提交订单
export function postPayPrecreate(params: RequesPrepay) {
  return request.post<{
    order_id: string
    pay_url: string
    pay_key: string
    qrcode?: string
  }>('/api/pay/precreate', params)
}

// 卡密充值
export function postUseCarmi(params: { carmi: string }) {
  return request.post('/api/use_carmi', params)
}

// 签到
export function postSignin() {
  return request.post('/api/signin')
}

// 获取签到列表
export function getSigninList() {
  return request.get<Array<SigninInfo>>('/api/signin/list')
}

// 重置用户密码
export function putUserPassword(params: RequestLoginParams) {
  return request.put('/api/user/password', params)
}

// 获取配置数据
export function getConfig() {
  return request.get<ResponseConfigData>('/api/config')
}

// 获取用户记录
export function getUserRecords(params: { page: number; page_size: number; type: string | number }) {
  return request.get<TableData<InvitationRecordInfo | ConsumeRecordInfo | WithdrawalRecordInfo>>(
    '/api/user/records',
    params
  )
}

// 申请提现
export function postUserWithdrawal(params: WithdrawalRecordInfo) {
  return request.post('/api/user/withdrawal', params)
}
