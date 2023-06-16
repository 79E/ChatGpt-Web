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
  AikeyInfo,
  TurnoverInfo,
  UserInfo,
  InviteRecordInfo,
  CashbackInfo,
  AmountDetailInfo,
  WithdrawalRecordInfo
} from '@/types/admin'
import request from '.'

// 获取卡密列表
export function getAdminCarmi(params: Paging) {
  return request.get<TableData<CarmiInfo>>('/api/admin/carmi', params)
}

// 检查卡密
export function getAdminCarmiCheck() {
  return request.get<TableData<CarmiInfo>>('/api/admin/carmi/check')
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
  return request.get<TableData<UserInfo>>('/api/admin/user', params)
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
  return request.get<TableData<TurnoverInfo>>('/api/admin/turnover', params)
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
  return request.get<TableData<SigninInfo>>('/api/admin/signin', params)
}

// 用户对话列表
export function getAdminMessages(params: Paging) {
  return request.get<TableData<MessageInfo>>('/api/admin/messages', params)
}

// 商品列表
export function getAdminProducts(params: Paging) {
  return request.get<TableData<ProductInfo>>('/api/admin/products', params)
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
export function getAdminAikeys(params: Paging) {
  return request.get<TableData<AikeyInfo>>('/api/admin/aikey', params)
}

// 删除Token
export function delAdminAikey(params: { id: string | number }) {
  return request.del(`/api/admin/aikey/${params.id}`)
}

// 新增token
export function postAdminAikey(params: AikeyInfo) {
  return request.post('/api/admin/aikey', params)
}

// 编辑token
export function putAdminAikey(params: AikeyInfo) {
  return request.put('/api/admin/aikey', params)
}
// 检查token
export function postAdminAikeyCheck(params: AikeyInfo | { all: boolean }) {
  return request.post('/api/admin/aikey/check', params)
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
  return request.get<TableData<PaymentInfo>>('/api/admin/payment', params)
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
  return request.get<TableData<OrderInfo>>('/api/admin/orders', params)
}

// 获取 Notification
export function getAdminNotification(params: Paging) {
  return request.get<TableData<NotificationInfo>>('/api/admin/notification', params)
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

// 获取邀请记录
export function getAdminInviteRecord(params: Paging) {
  return request.get<TableData<InviteRecordInfo>>('/api/admin/invite_record', params)
}

// 删除邀请记录
export function delAdminInviteRecord(params: { id: string | number }) {
  return request.del(`/api/admin/invite_record/${params.id}`)
}

// 修改邀请记录
export function putAdminInviteRecord(params: InviteRecordInfo) {
  return request.put('/api/admin/invite_record', params)
}

// 邀请通过
export function putAdminInviteRecordPass(params?: { id: string | number }) {
  return request.put('/api/admin/invite_record/pass', params)
}

// 获取回扣记录
export function getAdminCashback(params?: Paging) {
  return request.get<TableData<CashbackInfo>>('/api/admin/cashback', params)
}

// 删除回扣记录
export function delAdminCashback(params: { id: string | number }) {
  return request.del(`/api/admin/cashback/${params.id}`)
}

// 修改回扣记录
export function putAdminCashback(params: CashbackInfo) {
  return request.put('/api/admin/cashback', params)
}

// 通过提成
export function putAdminCashbackPass(params: { id: string | number }) {
  return request.put('/api/admin/cashback/pass', params)
}

// 获取金额明细记录
export function getAdminAmountDetails(params?: Paging) {
  return request.get<TableData<AmountDetailInfo>>('/api/admin/amount_details', params)
}

// 删除金额明细
export function delAdminAmountDetails(params: { id: string | number }) {
  return request.del(`/api/admin/amount_details/${params.id}`)
}

// 修改金额明细
export function putAdminAmountDetails(params: AmountDetailInfo) {
  return request.put('/api/admin/amount_details', params)
}

// 新增金额明细
export function postAdminAmountDetails(params: AmountDetailInfo) {
  return request.post('/api/admin/amount_details', params)
}

// 获取提现列表
export function getAdminWithdrawalRecords(params?: Paging) {
  return request.get<TableData<WithdrawalRecordInfo>>('/api/admin/withdrawal_record', params)
}

// 删除提现记录
export function delAdminWithdrawalRecord(params: { id: string | number }) {
  return request.del(`/api/admin/withdrawal_record/${params.id}`)
}

// 修改提现记录
export function putAdminWithdrawalRecord(params: WithdrawalRecordInfo) {
  return request.put('/api/admin/withdrawal_record', params)
}

// 新增提现记录
export function postAdminWithdrawalRecord(params: WithdrawalRecordInfo) {
  return request.post('/api/admin/withdrawal_record', params)
}

// 操作提现状态
export function putAdminWithdrawalRecordOperate(params: WithdrawalRecordInfo) {
	return request.put('/api/admin/withdrawal_record/operate', params)
  }
