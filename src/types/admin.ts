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
  status: number
  create_time: string
  update_time: string
}


export interface RequestAddCarmi {
  type: string,
  end_time: string,
  quantity: number,
  reward: number,
}

export interface UserInfo {
	id: string;
	account: string;
	nickname: string;
	avatar: string;
	integral: number;
	subscribe: string;
	ip: string;
	status: number;
	create_time: string;
	update_time: string;
}


export interface TurnoverInfo {
	id: string;
	user_id: string;
	value: string;
	describe: string;
	create_time: string;
	update_time: string;
}


export interface SigninInfo {
	id: string;
	user_id: string;
	ip: string;
	status: number;
	create_time: string;
	update_time: string;
}

export interface MessageInfo {
	id: string;
	content: string;
	role: string;
  user_id: number;
	frequency_penalty: number;
	max_tokens: number;
	model: string;
	presence_penalty: number;
	temperature: number;
	parent_message_id: string;
	status: number;
	create_time: string;
	update_time: string;
}

export interface ProductInfo {
	id: number;
	title: string;
	price: number;
	original_price: number;
	integral?: number;
	badge: string;
	day?: number;
	status: number;
	create_time: string;
	update_time: string;
}

export interface TokenInfo {
	id: number;
	key: string;
	host: string;
	remarks: string;
	limit: number;
	usage: number;
	status: number;
	create_time: string;
	update_time: string;
}

export interface ConfigInfo {
	id: number;
	name: string;
	value: string;
	remarks: string;
	create_time: string;
	update_time: string;
}