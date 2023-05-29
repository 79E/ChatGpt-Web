export interface Paging {
  page: number
  page_size: number
}

export interface TableData<T> {
  count: number
  rows: T
}

export interface CarmiInfo {
  id: number
  user_id: string
  ip: string
  key: string
  value: string
  type: string
  end_time?: string
  level: number
  status: number
  user?: UserInfo
  create_time: string
  update_time: string
}

export interface RequestAddCarmi {
  type: string
  end_time: string
  quantity: number
  reward: number
  level: number
}

export interface UserInfo {
  id: string
  account: string
  nickname: string
  avatar: string
  integral: number
  vip_expire_time: string
  svip_expire_time: string
  ip: string
  status: number
  create_time: string
  update_time: string
}

export interface TurnoverInfo {
  id: string
  user_id: string
  value: string
  describe: string
  user?: UserInfo
  create_time: string
  update_time: string
}

export interface SigninInfo {
  id: string
  user_id: string
  ip: string
  status: number
  user?: UserInfo
  create_time: string
  update_time: string
}

export interface MessageInfo {
  id: string
  content: string
  role: string
  user_id: number
  frequency_penalty: number
  max_tokens: number
  model: string
  presence_penalty: number
  temperature: number
  parent_message_id: string
  status: number
  user?: UserInfo
  create_time: string
  update_time: string
}

export interface ProductInfo {
  id: number
  title: string
  price: number
  original_price: number
  value: number
  badge: string
  status: number
  type: string
  level: number
  create_time: string
  update_time: string
}

export interface TokenInfo {
  id: number
  key: string
  host: string
  remarks: string
  models: string
  limit: number
  usage: number
  status: number
  create_time: string
  update_time: string
}

export interface ConfigInfo {
  id: number
  name: string
  value: string
  remarks: string
  create_time: string
  update_time: string
}

export interface AlipayInfo {
  appId: string | number
  keyType: string
  alipayPublicKey: string
  privateKey: string
}
export interface YipayInfo {
  api: string
  pid: string | number
  key: string
  return_url?: string
}

export interface PaymentInfo {
  id: number
  name: string
  channel: string
  types: string
  params: string
  status: number
  create_time: string
  update_time: string
}

export interface OrderInfo {
  id: string
  trade_no?: string
  pay_type: string
  product_id: string
  product_title: string
  trade_status: string
  user_id: string
  product_info: string
  channel: string
  params: string
  payment_id: string
  payment_info: string
  money: number
  notify_info?: string
  pay_url?: string
  ip: string
  user?: UserInfo
  create_time: string
  update_time: string
}

export interface NotificationInfo {
  id: number
  title: string
  content: string
  sort: number
  status: number
  create_time: string
  update_time: string
}
