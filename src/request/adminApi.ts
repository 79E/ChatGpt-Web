import {
  CarmiInfo,
  ConfigInfo,
  MessageInfo,
  NotificationInfo,
  OrderInfo,
  Paging,
  PaymentInfo,
  ProductInfo,
  RequestAddCarmi,
  SigninInfo,
  TableData,
  TokenInfo,
  TurnoverInfo,
  UserInfo
} from '@/types/admin'
import request from '.'

// 获取卡密列表
export function getAdminCarmi(params: Paging) {
  return request.get<TableData<Array<CarmiInfo>>>('/api/admin/carmi', params)
}

// 检查卡密
export function getAdminCarmiCheck() {
  return request.get<TableData<Array<CarmiInfo>>>('/api/admin/carmi/check')
}

// 删除卡密
export function delAdminCarmi(params: { id: string | number }) {
  return request.del(`/api/admin/carmi/${params.id}`)
}

// 批量生产卡密
export function addAdminCarmis(params: RequestAddCarmi) {
  return request.post<Array<CarmiInfo>>('/api/admin/carmi', params)
}

// 用户列表
export function getAdminUsers(params: Paging) {
  return request.get<TableData<Array<UserInfo>>>('/api/admin/user', params)
}
// 删除用户
export function delAdminUsers(params: { id: string | number }) {
  return request.del(`/api/admin/user/${params.id}`)
}
// 修改用户
export function putAdminUsers(params: UserInfo) {
  return request.put('/api/admin/user', params)
}

// 用户消费列表
export function getAdminTurnovers(params: Paging) {
  return request.get<TableData<Array<TurnoverInfo>>>('/api/admin/turnover', params)
}
// 删除用户消费记录
export function delAdminTurnover(params: { id: string | number }) {
  return request.del(`/api/admin/turnover/${params.id}`)
}
// 修改用户消费记录
export function putAdminTurnover(params: TurnoverInfo) {
  return request.put('/api/admin/turnover', params)
}

// 用户签到列表
export function getAdminSignin(params: Paging) {
  return request.get<TableData<Array<SigninInfo>>>('/api/admin/signin', params)
}

// 用户对话列表
export function getAdminMessages(params: Paging) {
  return request.get<TableData<Array<MessageInfo>>>('/api/admin/messages', params)
}

// 商品列表
export function getAdminProducts(params: Paging) {
  return request.get<TableData<Array<ProductInfo>>>('/api/admin/products', params)
}
// 删除商品
export function delAdminProduct(params: { id: string | number }) {
  return request.del(`/api/admin/products/${params.id}`)
}
// 新增商品
export function postAdminProduct(params: ProductInfo) {
  return request.post('/api/admin/products', params)
}
// 修改商品
export function putAdminProduct(params: ProductInfo) {
  return request.put('/api/admin/products', params)
}

// 获取Token
export function getAdminTokens(params: Paging) {
  return request.get<TableData<Array<TokenInfo>>>('/api/admin/token', params)
}

// 删除Token
export function delAdminToken(params: { id: string | number }) {
  return request.del(`/api/admin/token/${params.id}`)
}

// 新增token
export function postAdminToken(params: TokenInfo) {
  return request.post('/api/admin/token', params)
}

// 编辑token
export function putAdminToken(params: TokenInfo) {
  return request.put('/api/admin/token', params)
}
// 检查token
export function postAdminTokenCheck(params: TokenInfo | { all: boolean }) {
  return request.post('/api/admin/token/check', params)
}

// 获取配置数据
export function getAdminConfig() {
  return request.get<Array<ConfigInfo>>('/api/admin/config')
}

// 修改配置数据
export function putAdminConfig(params: { [key: string]: any }) {
  return request.put<Array<ConfigInfo>>('/api/admin/config', params)
}

// 获取支付渠道
export function getAdminPayment(params: Paging) {
  return request.get<TableData<Array<PaymentInfo>>>('/api/admin/payment', params)
}

// 删除渠道
export function delAdminPayment(params: { id: string | number }) {
  return request.del(`/api/admin/payment/${params.id}`)
}

// 新增渠道
export function addAdminPayment(params: PaymentInfo) {
  return request.post('/api/admin/payment', params)
}
// 编辑渠道
export function putAdminPayment(params: PaymentInfo) {
  return request.put('/api/admin/payment', params)
}

// 获取订单列表
export function getAdminOrders(params: Paging) {
  return request.get<TableData<Array<OrderInfo>>>('/api/admin/orders', params)
}

// 获取 Notification
export function getAdminNotification(params: Paging) {
  return request.get<TableData<Array<NotificationInfo>>>('/api/admin/notification', params)
}

// 删除 Notification
export function delAdminNotification(params: { id: string | number }) {
  return request.del(`/api/admin/notification/${params.id}`)
}

// 新增 Notification
export function postAdminNotification(params: NotificationInfo) {
  return request.post('/api/admin/notification', params)
}

// 编辑 Notification
export function putAdminNotification(params: NotificationInfo) {
  return request.put('/api/admin/notification', params)
}
