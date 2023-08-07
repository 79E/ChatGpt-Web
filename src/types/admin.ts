export interface Paging {
  page: number
  page_size: number
}

export interface TableData<T> {
  count: number
  rows: Array<T>
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
  persona_id?: string | number
  persona?: PersonaInfo
  user?: UserInfo
  create_time: string
  update_time: string
  plugin_id?: string | number
  plugin?: PluginInfo
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
  sort: number
  describe?: string
  create_time: string
  update_time: string
}

export interface AikeyInfo {
  id: number
  key: string
  host: string
  remarks: string
  models: string
  limit: number
  usage: number
  type: string
  check: number
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

export interface JsPayInfo {
	api: string
	mchid: string | number
	key: string
	return_url?: string
}


export interface HpjPayInfo {
	api: string
	appid: string | number
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

export interface InviteRecordInfo {
  id: string
  user_id: string
  invite_code: string
  superior_id: string
  reward: string
  reward_type: string
  user_agent: string
  remarks: string
  user: UserInfo
  superior: UserInfo
  ip: string
  status: number
  create_time: string
  update_time: string
}

export interface CashbackInfo {
  id: string
  user_id: string
  benefit_id: string
  pay_amount: string
  commission_rate: string
  commission_amount: string
  remarks: string
  order_id: number
  status: number
  create_time: string
  update_time: string
  user: UserInfo
  benefit: UserInfo
}

export interface AmountDetailInfo {
  id: string
  user_id: string
  correlation_id: number
  original_amount: string
  operate_amount: string
  type: string
  current_amount: string
  remarks: string
  status: number
  create_time: string
  update_time: string
  user: UserInfo
}

export interface WithdrawalRecordInfo {
  new_status?: number
  id: number
  user_id: string
  amount: string
  type: string
  name: string
  contact: string
  account: string
  remarks: string
  message: string
  ip: string
  user_agent: string
  status: number
  create_time: string
  update_time: string
  user: UserInfo
}

export interface DialogInfo {
  id: number | string
  issue: string
  answer: string
  models: string
  delay: number
  status: number
  create_time: string
  update_time: string
}


export interface PersonaInfo {
	id: string | number;
	user_id?: string | number;
	title: string;
	avatar: string;
	description?: string;
  	system: number
	context: string;
	status: number;
	create_time: string;
	update_time: string;
	user?: UserInfo;
}


export interface PluginInfo {
	id: number;
	user_id?: string | number;
	name: string;
	description: string;
	avatar: string;
	variables?: string;
	function: string;
	script: string;
	status: number;
	create_time: string;
	update_time: string;
	user?: UserInfo;
}


export interface DrawRecordInfo {
	id: string;
	user_id: string;
	inset_image_url?: string;
	prompt: string;
	model: string;
	images: string[];
	params: string;
	take_time: number;
	size: string;
	status: number;
	create_time: string;
	update_time: string;
  user?: UserInfo
}