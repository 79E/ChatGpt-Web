import aliOss from 'ali-oss'
import operateFile from './operateFile';
import { httpBody } from '../../utils';

export async function alioss(file, { region, bucket, access_key_id, access_key_secret }){
	const fileInfo = operateFile(file)
	const client = new aliOss({
		// yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
		region:region,
		// 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
		accessKeyId: access_key_id,
		accessKeySecret: access_key_secret,
		// 填写Bucket名称。
		bucket: bucket,
	});

	const result = await client.put(fileInfo.fileName, fileInfo.buffer)
	if(!result?.url){
		return httpBody(500, {}, '上传失败')
	}
	return httpBody(0, {
		...fileInfo,
		url: result.url
	}, '上传成功')
}

export default alioss;
