export interface RequestLoginParams {
    account: string;
    code: string | number;
}

export interface UserDetail {
	account: string;
	nickname: string;
	avatar: string;
	status: number;
	ip: string;
	created_at: string;
}

export interface ResponseLoginData {
    user_detail: UserDetail
    token?: string,
}

export interface ChatGptConfig {
    // 模型
	model?: string;
    // 输出随机性 0 - 2
    temperature?: number;
    // 惩罚性质 -2 - 2
    presence_penalty?: number;
    // 惩罚频率 -2 - 2
    frequency_penalty?: number
}

export interface PromptInfo {
	key: string;
    value: string;
}

export interface RequestChatOptions{
    prompt: string;
    options?: ChatGptConfig;
    parentMessageId?: string;
}

export interface ChatsInfo {
    path: string;
    id: number | string;
    name: string;
    parentMessageId?: string;
    data: Array<ChatGpt>;
}


export interface ChatResultInfo {
	id: string;
	role: string;
	text: string;
	dateTime: string;
	segment: string;
	parentMessageId: string;
}

// 对话记录
export interface ChatGpt {
    id: string | number;
    text: string;
    dateTime: string;
    status: 'pass' | 'loading' | 'error';
    role: 'assistant' | 'user' | string;
    requestOptions: RequestChatOptions;
}
