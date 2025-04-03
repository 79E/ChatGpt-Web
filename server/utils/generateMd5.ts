import crypto from 'crypto'
export default function generateMd5(str: string) {
  const md5 = crypto.createHash('md5').update(str).digest('hex')
  return md5
}
