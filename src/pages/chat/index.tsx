import { CommentOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Modal, Popconfirm, Space, Tabs, Select, message } from 'antd'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import styles from './index.module.less'
import useStore from '@/store'
import RoleNetwork from './components/RoleNetwork'
import RoleLocal from './components/RoleLocal'
import AllInput from './components/AllInput'
import ChatMessage from './components/ChatMessage'
import { RequestChatOptions } from '@/types'
import { postChatCompletions, postCompletions } from '@/request/api'
import Reminder from '@/components/Reminder'
import {
  filterObjectNull,
  formatTime,
  generateUUID,
  getAiKey,
  handleChatData,
  handleOpenChatData
} from '@/utils'
import { useScroll } from '@/hooks/useScroll'
import useDocumentResize from '@/hooks/useDocumentResize'
import Layout from '@/components/Layout'

function ChatPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollToBottomIfAtBottom, scrollToBottom } = useScroll(scrollRef.current)

  const {
    models,
    token,
    config,
    changeConfig,
    setConfigModal,
    chats,
    addChat,
    delChat,
    clearChats,
    selectChatId,
    changeSelectChatId,
    setChatInfo,
    setChatDataInfo,
    clearChatMessage,
    delChatMessage,
    setLoginModal
  } = useStore()

  const isProxy = import.meta.env.VITE_APP_MODE !== 'business'

  const bodyResize = useDocumentResize()

  // 角色预设
  const [roleConfigModal, setRoleConfigModal] = useState({
    open: false
  })

  useLayoutEffect(() => {
    if (scrollRef) {
      scrollToBottom()
    }
  }, [scrollRef.current, selectChatId, chats])

  // 当前聊天记录
  const chatMessages = useMemo(() => {
    const chatList = chats.filter((c) => c.id === selectChatId)
    if (chatList.length <= 0) {
      return []
    }
    return chatList[0].data
  }, [selectChatId, chats])

  // 创建对话按钮
  const CreateChat = () => {
    return (
      <Button
        block
        type="dashed"
        style={{
          marginBottom: 6,
          marginLeft: 0,
          marginRight: 0
        }}
        onClick={() => {
          // if (!token) {
          //   setLoginOptions({
          //     open: true
          //   })
          //   return
          // }
          addChat()
        }}
      >
        新建对话
      </Button>
    )
  }

  // 对接服务端方法
  async function serverChatCompletions({
    requestOptions,
    signal,
    userMessageId
  }: {
    userMessageId: string
    signal: AbortSignal
    requestOptions: RequestChatOptions
  }) {
    const response = await postCompletions(requestOptions, {
      options: {
        signal
      }
    })
      .then((res) => {
        return res
      })
      .catch((error) => {
        // 终止： AbortError
        console.log(error.name)
      })
    if (!(response instanceof Response)) {
      // 这里返回是错误 ...
      setChatDataInfo(selectChatId, userMessageId, {
        status: 'error'
      })
      setFetchController(null)
      message.error('请求失败')
      return
    }
    const reader = response.body?.getReader?.()
    let alltext = ''
    while (true) {
      const { done, value } = (await reader?.read()) || {}
      if (done) {
        setFetchController(null)
        break
      }
      // 将获取到的数据片段显示在屏幕上
      const text = new TextDecoder('utf-8').decode(value)
      const texts = handleChatData(text)
      for (let i = 0; i < texts.length; i++) {
        const { id, dateTime, parentMessageId, role, text, segment } = texts[i]
        alltext += text ? text : ''
        if (segment === 'stop') {
          setFetchController(null)
          setChatDataInfo(selectChatId, userMessageId, {
            status: 'pass'
          })
          setChatDataInfo(selectChatId, id, {
            text: alltext,
            dateTime,
            status: 'pass'
          })
          break
        }

        if (segment === 'start') {
          setChatDataInfo(selectChatId, userMessageId, {
            status: 'pass'
          })
          setChatInfo(
            selectChatId,
            {
              parentMessageId
            },
            {
              id,
              text: alltext,
              dateTime,
              status: 'loading',
              role,
              requestOptions
            }
          )
        }
        if (segment === 'text') {
          setChatDataInfo(selectChatId, id, {
            text: alltext,
            dateTime,
            status: 'pass'
          })
        }
      }
      scrollToBottomIfAtBottom()
    }
  }

  // 三方代码请求处理
  async function openChatCompletions({
    requestOptions,
    signal,
    userMessageId
  }: {
    userMessageId: string
    signal: AbortSignal
    requestOptions: RequestChatOptions
  }) {
    const sendMessages: Array<{ role: string; content: string }> = [
      { role: 'user', content: requestOptions.prompt }
    ]
    if (config.limit_message > 0) {
      const limitMessage = chatMessages.slice(-config.limit_message)
      if (limitMessage.length) {
        const list = limitMessage.map((item: any) => ({ role: item.role, content: item.text }))
        sendMessages.unshift(...list)
      }
    }
    const systemConfig = getAiKey(config)
    const response = await postChatCompletions(
      systemConfig.api,
      {
        model: config.model,
        messages: sendMessages,
        ...requestOptions.options
      },
      {
        headers: {
          Authorization: `Bearer ${systemConfig.api_key}`
        },
        options: {
          signal
        }
      }
    )
    if (!(response instanceof Response)) {
      setChatDataInfo(selectChatId, userMessageId, {
        status: 'error'
      })
      setFetchController(null)
      message.error('请求失败')
      return
    }
    const reader = response.body?.getReader?.()
    let alltext = ''
    while (true) {
      const { done, value } = (await reader?.read()) || {}
      if (done) {
        setFetchController(null)
        break
      }
      const text = new TextDecoder('utf-8').decode(value)
      const texts = handleOpenChatData(text)
      for (let i = 0; i < texts.length; i++) {
        const { id, dateTime, parentMessageId, role, text, segment } = texts[i]
        alltext += text ? text : ''
        if (segment === 'start') {
          setChatDataInfo(selectChatId, userMessageId, {
            status: 'pass'
          })
          setChatInfo(
            selectChatId,
            {
              parentMessageId
            },
            {
              id,
              text: alltext,
              dateTime,
              status: 'loading',
              role,
              requestOptions
            }
          )
        }
        if (segment === 'text') {
          setChatDataInfo(selectChatId, id, {
            text: alltext,
            dateTime,
            status: 'pass',
            role,
            requestOptions
          })
        }
        if (segment === 'stop') {
          setFetchController(null)
          setChatDataInfo(selectChatId, userMessageId, {
            status: 'pass'
          })
          setChatDataInfo(selectChatId, id, {
            text: alltext,
            dateTime,
            status: 'pass',
            role,
            requestOptions
          })
        }
      }
      scrollToBottomIfAtBottom()
    }
  }

  const [fetchController, setFetchController] = useState<AbortController | null>(null)

  // 对话
  async function sendChatCompletions(vaule: string) {
    if (!token && !isProxy) {
      setLoginModal(true)
      return
    }
    const parentMessageId = chats.filter((c) => c.id === selectChatId)[0].parentMessageId
    const userMessageId = generateUUID()
    const requestOptions = {
      prompt: vaule,
      parentMessageId,
      options: filterObjectNull({
        ...config,
        api: null,
        api_key: null,
        limit_message: null
      })
    }
    setChatInfo(
      selectChatId,
      {},
      {
        id: userMessageId,
        text: vaule,
        dateTime: formatTime(),
        status: 'pass',
        role: 'user',
        requestOptions
      }
    )
    const controller = new AbortController()
    const signal = controller.signal
    setFetchController(controller)
    const systemConfig = getAiKey(config)
    console.log('systemConfig', systemConfig)
    if (token) {
      serverChatCompletions({
        requestOptions,
        signal,
        userMessageId
      })
    } else if (isProxy && systemConfig.api && systemConfig.api_key) {
      // 这里是 openai 公共
      openChatCompletions({
        requestOptions,
        signal,
        userMessageId
      })
    } else {
      message.error('配置数据错误')
      controller.abort()
    }
  }

  return (
    <div className={styles.chatPage}>
      <Layout
        menuExtraRender={() => <CreateChat />}
        route={{
          path: '/',
          routes: chats
        }}
        menuDataRender={(item) => {
          return item
        }}
        menuItemRender={(item, dom) => {
          const className =
            item.id === selectChatId
              ? `${styles.menuItem} ${styles.menuItem_action}`
              : styles.menuItem
          return (
            <div className={className}>
              <span className={styles.menuItem_icon}>
                <CommentOutlined />
              </span>
              <span className={styles.menuItem_name}>{item.name}</span>
              <div className={styles.menuItem_options}>
                <Popconfirm
                  title="删除会话"
                  description="是否确定删除会话？"
                  onConfirm={() => {
                    delChat(item.id)
                  }}
                  onCancel={() => {
                    // ==== 无操作 ====
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>
              </div>
            </div>
          )
        }}
        menuFooterRender={(props) => {
          //   if (props?.collapsed) return undefined;
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                size="middle"
                style={{ width: '100%' }}
                defaultValue={config.model}
                value={config.model}
                options={models.map((m) => ({ ...m, label: 'AI模型: ' + m.label }))}
                onChange={(e) => {
                  changeConfig({
                    ...config,
                    model: e.toString()
                  })
                }}
              />
              <Button
                block
                onClick={() => {
                  setRoleConfigModal({ open: true })
                }}
              >
                角色预设
              </Button>
              <Button
                block
                onClick={() => {
                  setConfigModal(true)
                  // chatGptConfigform.setFieldsValue({
                  //   ...config
                  // })
                  // setChatConfigModal({ open: true })
                }}
              >
                系统配置
              </Button>
              <Popconfirm
                title="删除全部对话"
                description="您确定删除全部会话对吗? "
                onConfirm={() => {
                  clearChats()
                }}
                onCancel={() => {
                  // ==== 无操作 ====
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button block danger type="dashed" ghost>
                  清除所有对话
                </Button>
              </Popconfirm>
            </Space>
          )
        }}
        menuProps={{
          onClick: (r) => {
            const id = r.key.replace('/', '')
            if (selectChatId !== id) {
              changeSelectChatId(id)
            }
          }
        }}
      >
        <div className={styles.chatPage_container}>
          <div ref={scrollRef} className={styles.chatPage_container_one}>
            <div id="image-wrapper">
              {chatMessages.map((item) => {
                return (
                  <ChatMessage
                    key={item.id}
                    position={item.role === 'user' ? 'right' : 'left'}
                    status={item.status}
                    content={item.text}
                    time={item.dateTime}
                    onDelChatMessage={() => {
                      delChatMessage(selectChatId, item.id)
                    }}
                  />
                )
              })}
              {chatMessages.length <= 0 && <Reminder />}
            </div>
          </div>
          <div className={styles.chatPage_container_two}>
            <AllInput
              disabled={!!fetchController}
              onSend={(value) => {
                if (value.startsWith('/')) return
                sendChatCompletions(value)
                scrollToBottomIfAtBottom()
              }}
              clearMessage={() => {
                clearChatMessage(selectChatId)
              }}
              onStopFetch={() => {
                // 结束
                setFetchController((c) => {
                  c?.abort()
                  return null
                })
              }}
            />
          </div>
        </div>
      </Layout>

      {/* AI角色预设 */}
      <Modal
        title="AI角色预设"
        open={roleConfigModal.open}
        footer={null}
        destroyOnClose
        onCancel={() => setRoleConfigModal({ open: false })}
        width={800}
        style={{
          top: 50
        }}
      >
        <Tabs
          tabPosition={bodyResize.width <= 600 ? 'top' : 'left'}
          items={[
            {
              key: 'roleLocal',
              label: '本地数据',
              children: <RoleLocal />
            },
            {
              key: 'roleNetwork',
              label: '网络数据',
              children: <RoleNetwork />
            }
          ]}
        />
      </Modal>
    </div>
  )
}
export default ChatPage
