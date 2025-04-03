import fetch from 'node-fetch'
import FormData from 'form-data'
import operateFile from './operateFile'
import { httpBody } from '../../utils'

export async function lsky(file, { api_host, secret_key }) {
  const fileInfo = operateFile(file)
  const data = new FormData()
  data.append('file', fileInfo.buffer, { filename: fileInfo.originalname })
  const result = await fetch(`${api_host}/api/v1/upload`, {
    method: 'post',
    body: data,
    headers: {
      Authorization: `Bearer ${secret_key}`
    }
  })
  const json = await result.json()
  console.log(json)
  if(!json.status){
    return httpBody(500, {}, '上传失败')
  }
  return httpBody(0, {
    ...fileInfo,
    url: json.data.links.url
  }, '上传成功')
}
