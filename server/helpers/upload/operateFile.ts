import path from 'path'
import crypto from 'crypto'
import { NodeFile } from '../../type'

function operateFile(file: NodeFile) {
  const sha1 = crypto.createHash('sha1').update(file.buffer).digest('hex')
  const md5 = crypto.createHash('md5').update(file.buffer).digest('hex')
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dirPath = `uploads/${year}/${month}/${day}`
  const fileNameMd5 = crypto
    .createHash('md5')
    .update(`${Date.now()}_${file.originalname}`)
    .digest('hex')
  const fileName = `${fileNameMd5}.${file.originalname.split('.').pop()}`
  const filePath = path.join(dirPath, fileName)

  return {
	...file,
	filePath,
	fileName,
	sha1,
	md5,
	dirPath
  }
}

export default operateFile;
