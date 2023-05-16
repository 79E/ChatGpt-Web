import { ChatResultInfo } from '@/types'
import { formatTime } from './formatTime'

let messageId = '';
export function handleOpenChatData(chunk: string): ChatResultInfo[] {
  // 将字符串按照连续的两个换行符进行分割
  let chunks = chunk.toString().split(/\n{2}/g)
  // 过滤掉空白的消息
  chunks = chunks.filter((item) => item.trim())

  const contents: Array<ChatResultInfo> = []
  for (let i = 0; i < chunks.length; i++) {
    const message: string = chunks[i]

    let payload: any = message.replace(/^data: /, '')

    if (payload === '[DONE]') {
      contents.push({
        id: messageId,
        role: 'assistant',
        segment: 'stop',
        dateTime: formatTime(),
        text: '',
        parentMessageId: ''
      })

      messageId = '';
      break
    }

    try {
      payload = JSON.parse(payload)
    } catch (e) {
      // 忽略无法解析为 JSON 的消息
      continue
    }

    const payloadContent = payload.choices?.[0]?.delta?.content
    const payloadRole = payload.choices?.[0]?.delta?.role
    const segment = payload === '[DONE]' ? 'stop' : payloadRole === 'assistant' ? 'start' : 'text'
    
    messageId = payload.id;

    contents.push({
      id: payload.id,
      role: 'assistant',
      segment,
      dateTime: formatTime(),
      text: payloadContent,
      parentMessageId: ''
    })
  }
  return contents
}
