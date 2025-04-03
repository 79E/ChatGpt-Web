import fetch from 'node-fetch'
import { Transform } from 'stream'
import { Response } from 'express'
import { handleChatData, httpBody } from '../../utils'

type AikeyInfo = {
  host: string
  key: string
}

async function fetchChatCompletions(aikeyInfo: AikeyInfo, options: { [key: string]: any }) {
  const chat = await fetch(`${aikeyInfo.host}/v1/chat/completions`, {
    method: 'POST',
    body: JSON.stringify({
      ...options
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${aikeyInfo.key}`
    }
  })

  return chat
}

async function fetchChatFunction(
  aikeyInfo: AikeyInfo,
  options: {
    messages: Array<{ [key: string]: any }>
    functions: Array<{ [key: string]: any }>,
	model?: string
  }
) {
  try {
    const chat = await fetch(`${aikeyInfo.host}/v1/chat/completions`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0613',
        stream: false,
        function_call: 'auto',
        ...options
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aikeyInfo.key}`
      }
    })
    if (chat.status !== 200) return false
    const json = await chat.json()
    const message = json.choices[0].message
    return message
  } catch (error) {
    return false
  }
}

async function streamChatCompletions(
  aikeyInfo: AikeyInfo,
  options: { [key: string]: any },
  res: Response,
  stopCallback: (content: string) => void,
  content?: {[key: string]: any}
) {
  const chat = await fetchChatCompletions(aikeyInfo, options)
  if (chat.status === 200 && chat.headers.get('content-type')?.includes('text/event-stream')) {
    // 想在这里打印数据
    let allContent = ''
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8')
    const jsonStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        const bufferString = Buffer.from(chunk).toString()
        const listString = handleChatData(bufferString, {
          parentMessageId: 'assistantMessageId',
          content
        })

        const list = listString.split('\n\n')
        for (let i = 0; i < list.length; i++) {
          if (list[i]) {
            const jsonData = JSON.parse(list[i])
            if (jsonData.segment === 'stop') {
              stopCallback(allContent)
            } else {
              allContent += jsonData.content
            }
          }
        }
        callback(null, listString)
      }
    })
    chat.body?.pipe(jsonStream).pipe(res)
    return
  }
  const data = await chat.json()
  res.status(chat.status).json(httpBody(-1, data, ''))
}

export default {
  fetchChatCompletions,
  streamChatCompletions,
  fetchChatFunction
}
