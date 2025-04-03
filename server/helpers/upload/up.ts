import upyun from 'upyun'
import operateFile from './operateFile';
import { httpBody } from '../../utils';

export async function up(file, { host, bucket, secret_id, secret_key }){
	const service = new upyun.Service(bucket, secret_id, secret_key)
	const client = new upyun.Client(service);
	const fileInfo = operateFile(file)
	await client.putFile(fileInfo.filePath, fileInfo.buffer)
	return httpBody(0, {
		...fileInfo,
		url: host + fileInfo.filePath
	}, '上传成功')
}
