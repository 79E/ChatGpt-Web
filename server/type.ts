import { Request } from 'express'
export interface ExpressRequest extends Request {
  user_id?: string,
  files?: Array<NodeFile>,
  file?: NodeFile
}

export interface Paging {
  page: number
  page_size: number
}

export interface MessageInfo {
	id: string;
	content: string;
	user_id: string;
	role: string;
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

export interface NodeFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer;
	size: number;
}
