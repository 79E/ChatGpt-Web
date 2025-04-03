import crypto from 'crypto'
export default function generateToken(info: { [key: string]: any }, secret = 'chatgpt') {
  const timestamp = Date.now().toString() // 可以使用可读性更高的日期字符串
  const str = JSON.stringify(info) + timestamp + secret
  const sha256 = crypto.createHash('sha256').update(str).digest('hex')
  const md5 = crypto.createHash('md5').update(sha256).digest('hex')
  return md5
}
