export interface RequestLoginParams {
  account: string
  code: string | number
}

export interface UserDetail {
  account: string
  nickname: string
  avatar: string
  status: number
  ip: string
  created_at: string
  integral: number
}

export interface ResponseLoginData {
  user_detail: UserDetail
  token?: string
}

export interface ChatGptConfig {
  // 模型
  model: string
  // 输出随机性 0 - 2
  temperature?: number
  // 惩罚性质 -2 - 2
  presence_penalty?: number
  // 惩罚频率 -2 - 2
  frequency_penalty?: number
  // 携带历史消息数
  limit_message: number
  // 单次回复限制
  max_tokens?: number
}

export interface PromptInfo {
  key: string
  value: string
}

export interface RequestChatOptions {
  prompt: string
  options?: Omit<ChatGptConfig, 'api' | 'api_key' | 'limit_message'>
  parentMessageId?: string
}

// 请求Openai 或者 其他代理
export interface RequestOpenChatOptions {
  model: string
  messages: Array<{
    role: 'assistant' | 'user' | string
    content: string
  }>
  // 输出随机性 0 - 2
  temperature?: number
  // 惩罚性质 -2 - 2
  presence_penalty?: number
  // 惩罚频率 -2 - 2
  frequency_penalty?: number
  // 单次回复限制
  max_tokens?: number
  stream?: boolean
}

export interface ChatsInfo {
  path: string
  id: number | string
  name: string
  parentMessageId?: string
  data: Array<ChatGpt>
}

export interface ChatResultInfo {
  id: string
  role: string
  text: string
  dateTime: string
  segment: string
  parentMessageId: string
}

// 对话记录
export interface ChatGpt {
  id: string | number
  text: string
  dateTime: string
  status: 'pass' | 'loading' | 'error'
  role: 'assistant' | 'user' | string
  requestOptions: RequestChatOptions
}

export interface RequestImagesGenerations {
  prompt: string
  n?: number
  size?: string
  response_format?: string
}

export interface ImagesInfo extends RequestImagesGenerations {
  id: string
  dateTime: string
  url: string
}

// 三方订阅 信息
export interface SubscriptionInfo {
  hard_limit_usd: number
  has_payment_method: boolean
}

export interface RequesPrepay {
  pay_type: 'alipay' | 'wxpay'
  product_id: number
  num: number
}

export interface ProductInfo {
  id: number
  title: string
  amount: string
  integral: number
}
