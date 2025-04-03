import express from 'express'
import {
  configModel,
  messageModel,
  aikeyModel,
  turnoverModel,
  userModel,
  actionModel,
  dialogModel,
  personaModel,
  installedPluginModel,
  pluginModel
} from '../../models'
import chat from '../../helpers/chat'
import { GPTTokens, supportModelType } from 'gpt-tokens'
import {
  httpBody,
  getClientIP,
  generateNowflakeId,
  generateUUID,
  checkProhibitedWords
} from '../../utils'
import { ExpressRequest } from '../../type'
import { formatTime } from '../../utils'
import textModeration from '../../helpers/textModeration'
import jsvm from '../../helpers/jsvm'

const router = express.Router()

// 单次对话
router.post('/chat/completion', async (req: ExpressRequest, res, next) => {
  const user_id = req?.user_id
  if (!user_id) {
    res.status(500).json(httpBody(-1, '服务端错误'))
    return
  }
  const { prompt, type = 'draw' } = req.body
  const ip = getClientIP(req)
  const messages: Array<any> = []
  const systemMessages = await personaModel.getPersonaContext({
    status: 1,
    system: 1
  })

  messages.push(...systemMessages)

  if (type === 'draw') {
    messages.push(
      {
        role: 'system',
        content:
          // eslint-disable-next-line quotes
          "你需要为我生成AI绘画提示词，回答的形式是：(image we're prompting), (7 descriptivekeywords), (time of day), (Hd degree).这是一段段按照上述形式的示例问答：问题：参考以上midjoruney prompt formula写1个midjourney prompt内容，用英文回复，不要括号，内容：宫崎骏风格的春天小镇回答：英文：Miyazaki Hayao-style town,Green willow and red flowers, breeze coming, dreamy colors, fantastic elements, fairy-tale situation, warm breath, shooting in the evening, 4K ultra HD 现在严格参考以上的示例回答形式和风格（这很重要）。"
      },
      {
        role: 'user',
        content: `请根据以下的内容生成提示词(直接以英文输出，需要补全):${prompt}`
      }
    )
  } else if (type === 'mapping') {
    messages.push(
      {
        role: 'system',
        content:
          // eslint-disable-next-line quotes
          "You are ChatGPT, a large language model trained by OpenAI. Please carefully follow the user's instructions. I need to use the Xmind tool to create a mind map, and you need to provide text in Markdown format that is compatible with Xmind."
      },
      {
        role: 'user',
        content: prompt
      }
    )
  } else {
    messages.push({
      role: 'user',
      content: prompt
    })
  }

  const options: {
    model: supportModelType
  } = {
    model: 'gpt-3.5-turbo-16k'
  }

  const userInfo = await userModel.getUserInfo({
    id: user_id
  })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const vipExpireTime = new Date(userInfo.vip_expire_time).getTime()
  const svipExpireTime = new Date(userInfo.svip_expire_time).getTime()

  const ai3_ratio = (await configModel.getConfigValue('ai3_ratio')) || 0
  const chatRatio = Number(ai3_ratio)

  // 计算基础token费用
  const askUsageTokenInfo = new GPTTokens({
    model: options.model,
    messages: [...messages]
  })
  const asTokens = askUsageTokenInfo.usedTokens

  // 提问所用积分数
  const asIntegral = chatRatio ? Math.ceil(asTokens / chatRatio) : 0

  if (
    !(userInfo.integral > asIntegral || vipExpireTime >= todayTime || svipExpireTime >= todayTime)
  ) {
    res.status(400).json(httpBody(-1, [], '账户积分余额不足, 请充值后在使用。'))
    return
  }

  const aikeyInfo = await aikeyModel.getOneAikey({ model: options.model })
  if (!aikeyInfo || !aikeyInfo.id) {
    res.status(500).json(httpBody(-1, '管理员未配置对应AI模型'))
    return
  }

  await chat.streamChatCompletions(
    aikeyInfo,
    {
      ...options,
      messages,
      stream: true
    },
    res,
    (content) => {
      const describe =
        type === 'draw' ? '绘画文案优化' : type === 'mapping' ? '生成思维导图' : '对话'
      console.log()
      if (!(svipExpireTime > todayTime || vipExpireTime > todayTime)) {
        const allUsageTokenInfo = new GPTTokens({
          model: options.model,
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: content
            }
          ]
        })
        const tokens = allUsageTokenInfo.usedTokens
        const integral = chatRatio ? Math.ceil(tokens / chatRatio) : 0
        userModel.updataUserVIP({
          id: user_id,
          type: 'integral',
          value: integral,
          operate: 'decrement'
        })
        const turnoverId = generateNowflakeId(1)()
        turnoverModel.addTurnover({
          id: turnoverId,
          user_id,
          describe,
          value: `-${integral}积分`
        })
        actionModel.addAction({
          user_id,
          id: generateNowflakeId(23)(),
          ip,
          type: 'chat',
          describe: `${type}${describe}(${options.model})`
        })
      }
    }
  )
})

// 对话
router.post('/chat/completions', async (req: ExpressRequest, res, next) => {
  const user_id = req?.user_id
  if (!user_id) {
    res.status(500).json(httpBody(-1, '服务端错误'))
    return
  }

  const userInfo = await userModel.getUserInfo({
    id: user_id
  })

  const ip = getClientIP(req)

  const { prompt, parentMessageId, persona_id = null } = req.body
  const options = {
    frequency_penalty: 0,
    model: 'gpt-3.5-turbo-16k',
    presence_penalty: 0,
    temperature: 0,
    ...req.body.options,
    max_tokens: null
  }

  const systemMessages = await personaModel.getPersonaContext({
    status: 1,
    system: 1
  })

  const personaMessages = await personaModel.getPersonaContext({
    id: persona_id,
    status: 1,
    system: 0
  })

  // 获取历史条数
  const ai3CarryCount = await configModel.getConfigValue('ai3_carry_count')
  const ai4CarryCount = await configModel.getConfigValue('ai4_carry_count')
  let historyMessageCount = Number(ai3CarryCount) || 0

  if (options.model.indexOf('gpt-4') !== -1) {
    historyMessageCount = Number(ai4CarryCount) || 0
  }

  const getMessagesData = await messageModel.getMessages(
    { page: 0, page_size: Number(historyMessageCount) },
    {
      user_id,
      parent_message_id: parentMessageId,
      status: 1
    }
  )

  const historyMessage = getMessagesData.rows
    .map((item) => {
      return {
        role: item.toJSON().role,
        content: item.toJSON().content
      }
    })
    .reverse()

  const messages: Array<any> = [
    ...systemMessages,
    ...personaMessages,
    ...historyMessage,
    {
      role: 'user',
      content: prompt
    }
  ]

  // 获取比例
  const ai3_ratio = (await configModel.getConfigValue('ai3_ratio')) || 0
  const ai4_ratio = (await configModel.getConfigValue('ai4_ratio')) || 0
  const aiRatioInfo = {
    ai3_ratio,
    ai4_ratio
  }

  // 计算基础token费用
  const askUsageTokenInfo = new GPTTokens({
    model: options.model,
    messages: [...messages]
  })

  const asTokens = askUsageTokenInfo.usedTokens
  let chatRatio = Number(aiRatioInfo.ai3_ratio)
  if (options.model.indexOf('gpt-4') !== -1) {
    chatRatio = Number(aiRatioInfo.ai4_ratio)
  }
  // 提问所用积分数
  const asIntegral = chatRatio ? Math.ceil(asTokens / chatRatio) : 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const vipExpireTime = new Date(userInfo.vip_expire_time).getTime()
  const svipExpireTime = new Date(userInfo.svip_expire_time).getTime()
  if (
    !(userInfo.integral > asIntegral || vipExpireTime >= todayTime || svipExpireTime >= todayTime)
  ) {
    res.status(400).json(httpBody(-1, [], '账户积分余额不足, 请充值后在使用。'))
    return
  }

  if (options.model.includes('gpt-4') && svipExpireTime < todayTime && userInfo.integral <= 0) {
    res.status(400).json(httpBody(-1, [], 'GPT4为超级会员使用或用积分'))
    return
  }

  const aikeyInfo = await aikeyModel.getOneAikey({ model: options.model })
  if (!aikeyInfo || !aikeyInfo.id) {
    res.status(500).json(httpBody(-1, '管理员未配置对应AI模型'))
    return
  }

  const assistantMessageId = generateNowflakeId(2)()
  const userMessageId = generateNowflakeId(1)()
  const userMessageInfo = {
    user_id,
    id: userMessageId,
    role: 'user',
    content: prompt,
    parent_message_id: parentMessageId,
    persona_id: persona_id ? persona_id : null,
    create_time: formatTime(),
    ...options
  }
  const assistantInfo = {
    user_id,
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    parent_message_id: parentMessageId,
    persona_id: persona_id ? persona_id : null,
    create_time: formatTime(),
    ...options
  }

  // 这里判断库中是否有 内置的问答
  const dialogInfo = await dialogModel.getOneDialogInfo({
    issue: prompt,
    model: options.model.substring(0, 5)
  })
  if (dialogInfo && dialogInfo.answer) {
    const answer = dialogInfo?.answer || ''
    assistantInfo.content = answer
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    const uuid = generateUUID()
    const time = dialogInfo.delay || 0
    const sendAnswer = async () => {
      for (let i = 0; i < answer.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * time)) // 随机延迟 0~500ms
        const data = `${JSON.stringify({
          id: uuid,
          role: 'assistant',
          segment: i ? 'text' : 'start',
          dateTime: formatTime(),
          content: answer[i],
          parentMessageId
        })}\n\n`
        res.write(data)
      }

      const data = `${JSON.stringify({
        id: uuid,
        role: 'assistant',
        segment: 'end',
        dateTime: formatTime(),
        content: '',
        parentMessageId
      })}\n\n`
      res.write(data)

      await messageModel.addMessages([
        userMessageInfo,
        {
          ...assistantInfo,
          create_time: formatTime()
        }
      ])
      if (
        (options.model.includes('gpt-4') && svipExpireTime < todayTime) ||
        (!options.model.includes('gpt-4') && vipExpireTime < todayTime)
      ) {
        const allUsageTokenInfo = new GPTTokens({
          model: options.model,
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: assistantInfo.content
            }
          ]
        })
        const tokens = allUsageTokenInfo.usedTokens
        const integral = chatRatio ? Math.ceil(tokens / chatRatio) : 0
        userModel.updataUserVIP({
          id: user_id,
          type: 'integral',
          value: integral,
          operate: 'decrement'
        })
        const turnoverId = generateNowflakeId(1)()
        turnoverModel.addTurnover({
          id: turnoverId,
          user_id,
          describe: `对话(${options.model})`,
          value: `-${integral}积分`
        })
      }

      res.end()
    }

    await sendAnswer()

    return
  }

  // 内容审核
  const tuputech_key = await configModel.getConfigValue('tuputech_key')
  const prohibited_words = await configModel.getConfigValue('prohibited_words')
  if (tuputech_key) {
    const { action, details } = await textModeration.tuputech(tuputech_key, prompt)
    const matchedWords = Array.isArray(details) ? details?.map((item) => item.hint) : []
    if (action !== 'pass') {
      res
        .status(500)
        .json(
          httpBody(
            -1,
            `很抱歉，您发送的内容违反了我们的规定，请修改后重新尝试。涉及敏感词：\`${matchedWords.join(
              '`、`'
            )}\``
          )
        )
      return
    }
  } else if (prohibited_words) {
    const { action, matchedWords = [] } = await checkProhibitedWords(prompt, prohibited_words)
    if (action !== 'pass') {
      res
        .status(500)
        .json(
          httpBody(
            -1,
            `很抱歉，您发送的内容违反了我们的规定，请修改后重新尝试。涉及敏感词：\`${matchedWords.join(
              '`、`'
            )}\``
          )
        )
      return
    }
  }

  // 查询用户是否安装了插件
  const pluginMessages: Array<any> = []
  const installedPluginIds = await installedPluginModel.getUserInstalledPluginIds(user_id, {}, true)
  let selectPlugin: { [key: string]: string } | undefined = undefined
  let selectPluginModel: string | undefined = undefined
  if (installedPluginIds && installedPluginIds.length > 0) {
	selectPluginModel = options.model.includes('gpt-4') ? 'gpt-4-0613' : 'gpt-3.5-turbo-0613'
    // 查看插件
    const plugins = await pluginModel.getInPlugins(installedPluginIds)
    const functionCallMessage = await chat.fetchChatFunction(aikeyInfo, {
      messages: [{ role: 'user', content: prompt }],
      functions: plugins.map((item) => JSON.parse(item.function)),
	  model: selectPluginModel
    })

    if (functionCallMessage?.function_call) {
      const scriptName = functionCallMessage.function_call.name || ''
      let params = functionCallMessage.function_call.arguments || undefined
      params = params.replace(/\n/g, '').replace(/\\/g, '')
      params = JSON.parse(params)

      selectPlugin =
        plugins.filter((item) => {
          const functionJson = JSON.parse(item.function)
          if (functionJson.name === scriptName) {
            return true
          }
          return false
        })[0] || undefined
      if (selectPlugin) {
        const variables = JSON.parse(selectPlugin.variables)
        const env = {}
        if (variables && Array.isArray(variables)) {
          variables.forEach((item) => {
            env[item.label] = item.value
          })
        }

        const runScriptResult = await jsvm.safeRunScript({
          script: selectPlugin.script,
          scriptName,
          env,
          params
        })

        if (runScriptResult) {
          pluginMessages.push(functionCallMessage)
          pluginMessages.push({
            role: 'function',
            name: scriptName,
            content: JSON.stringify(runScriptResult)
          })
        }
      }
    }
  }

  await chat.streamChatCompletions(
    aikeyInfo,
    {
      ...options,
	  model: selectPluginModel || options.model,
      messages: [...messages, ...pluginMessages],
      stream: true
    },
    res,
    (content) => {
      // 结束存入数据库
      // 这里扣除一些东西
      // 将用户的消息存入数据库
      // 将返回的数据存入数据库
      // 扣除相关
      assistantInfo.content = content
      if (
        (options.model.includes('gpt-4') && svipExpireTime < todayTime) ||
        (!options.model.includes('gpt-4') && vipExpireTime < todayTime)
      ) {
        const allUsageTokenInfo = new GPTTokens({
          model: options.model,
          messages: [
            ...messages,
            {
              role: 'assistant',
              content: content
            }
          ]
        })
        const tokens = allUsageTokenInfo.usedTokens
        const integral = chatRatio ? Math.ceil(tokens / chatRatio) : 0
        userModel.updataUserVIP({
          id: user_id,
          type: 'integral',
          value: integral,
          operate: 'decrement'
        })
        const turnoverId = generateNowflakeId(1)()
        turnoverModel.addTurnover({
          id: turnoverId,
          user_id,
          describe: `对话(${options.model})`,
          value: `-${integral}积分`
        })
      }
      messageModel.addMessages([
        userMessageInfo,
        {
          ...assistantInfo,
          plugin_id: selectPlugin?.id || null,
          create_time: formatTime()
        }
      ])
      actionModel.addAction({
        user_id,
        id: generateNowflakeId(23)(),
        ip,
        type: 'chat',
        describe: `对话(${options.model})`
      })
    },
    {
      pluginInfo: selectPlugin ? {
        id: selectPlugin?.id,
        name: selectPlugin?.name,
        avatar: selectPlugin?.avatar,
        description: selectPlugin?.description
      } : undefined
    }
  )
})

export default router
