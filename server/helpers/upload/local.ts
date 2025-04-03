import fs from 'fs'
import operateFile from './operateFile'
import { httpBody } from '../../utils'

export async function local(file, { host }){
  const fileInfo = operateFile(file)
  if (!fs.existsSync(fileInfo.dirPath)) {
    fs.mkdirSync(fileInfo.dirPath, { recursive: true })
  }
  try {
    await fs.promises.writeFile(fileInfo.filePath, file.buffer)
    return httpBody(0, {
      ...fileInfo,
      url: host + '/' +fileInfo.filePath
    })
  } catch (err) {
    return httpBody(500, {}, '上传失败')
  }
}

