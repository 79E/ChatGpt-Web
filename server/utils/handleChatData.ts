import formatTime from './formatTime'

export default function handleOpenChatData(chunk: string, options: {
  parentMessageId: string,
  content?: {[key: string]: any}
}) {
  // 将字符串按照连续的两个换行符进行分割
  let chunks = chunk.toString().split(/\n{2}/g)
  // 过滤掉空白的消息
  chunks = chunks.filter((item) => item.trim())

  const contents: Array<string> = []
  for (let i = 0; i < chunks.length; i++) {
    const message: string = chunks[i]

    let payload: any = message.replace(/^data: /, '')

    if (payload === '[DONE]') {
      contents.push(
        JSON.stringify({
          id: '',
          role: 'assistant',
          segment: 'stop',
          dateTime: formatTime(),
          content: '',
          parentMessageId: options.parentMessageId,
          ...options?.content
        })
      )
    }

    try {
      payload = JSON.parse(payload)
    } catch (e) {
      // 忽略无法解析为 JSON 的消息
      continue
    }

    const payloadContent = payload.choices?.[0]?.delta?.content || ''
    const payloadRole = payload.choices?.[0]?.delta?.role
    const segment = payload === '[DONE]' ? 'stop' : payloadRole === 'assistant' ? 'start' : 'text'

    contents.push(
      JSON.stringify({
        id: payload.id,
        role: 'assistant',
        segment,
        dateTime: formatTime(),
        content: payloadContent,
        parentMessageId: options.parentMessageId,
        ...options?.content
      }) + '\n\n'
    )
  }
  return contents.join('')
}
