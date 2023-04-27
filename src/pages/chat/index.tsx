import {
  LogoutOutlined,
  CommentOutlined,
  LockOutlined,
  MobileOutlined,
  HeartFilled,
  RedditCircleFilled,
  SlackCircleFilled,
  TwitterCircleFilled,
  DeleteOutlined,
  GithubFilled,
  CloudSyncOutlined
} from '@ant-design/icons'
import {
  LoginForm,
  ModalForm,
  ProForm,
  ProFormCaptcha,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
  ProFormText,
  ProLayout
} from '@ant-design/pro-components'
import {
  Button,
  Dropdown,
  Form,
  Modal,
  Popconfirm,
  Segmented,
  Space,
  Tabs,
  Radio,
  Select,
  message
} from 'antd'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import styles from './index.module.less'
import useStore from '@/store'
import RoleNetwork from './components/RoleNetwork'
import RoleLocal from './components/RoleLocal'
import AllInput from './components/AllInput'
import ChatMessage from './components/ChatMessage'
import {
  ChatGptConfig,
  RequestChatOptions,
  RequestLoginParams,
  RequestOpenChatOptions
} from '@/types'
import { getCode, postChatCompletions, postCompletions } from '@/request/api'
import { fetchLogin } from '@/store/async'
import Reminder from '@/components/Reminder'
import {
  filterObjectNull,
  formatTime,
  generateUUID,
  handleChatData,
  handleOpenChatData
} from '@/utils'
import { useScroll } from '@/hooks/useScroll'
import useDocumentResize from '@/hooks/useDocumentResize'
import FormItemCard from '@/components/FormItemCard'
import GoodsPay from './components/GoodsPay'

function ChatPage() {
  const [chatGptConfigform] = Form.useForm<ChatGptConfig>()
  const [loginForm] = Form.useForm()

  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollToBottomIfAtBottom, scrollToBottom } = useScroll(scrollRef.current)

  const {
    models,
    token,
    config,
    changeConfig,
    user_detail,
    chats,
    addChat,
    delChat,
    clearChats,
    selectChatId,
    changeSelectChatId,
    setChatInfo,
    setChatDataInfo,
    logout,
    clearChatMessage,
    delChatMessage
  } = useStore()

  const bodyResize = useDocumentResize()

  // 登陆信息
  const [loginOptions, setLoginOptions] = useState({
    open: false
  })

  // 配置信息
  const [chatConfigModal, setChatConfigModal] = useState({
    open: false
  })

  // 角色预设
  const [roleConfigModal, setRoleConfigModal] = useState({
    open: false
  })

  useLayoutEffect(() => {
    if (scrollRef) {
      scrollToBottom()
    }
  }, [scrollRef.current, selectChatId, chats])

  const [goodsPayOptions, setGoodsPayOptions] = useState({
    open: false
  })

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
        const list = limitMessage.map((item) => ({ role: item.role, content: item.text }))
        sendMessages.unshift(...list)
      }
    }
    const response = await postChatCompletions(
      config.api,
      {
        model: config.model,
        messages: sendMessages,
        ...requestOptions.options
      },
      {
        headers: {
          Authorization: `Bearer ${config.api_key}`
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
    if (!token && (!config.api_key || !config.api)) {
      setLoginOptions({
        open: true
      })
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
    if (config.api && config.api_key) {
      // 这里是 openai 公共
      openChatCompletions({
        requestOptions,
        signal,
        userMessageId
      })
    } else if (token) {
      serverChatCompletions({
        requestOptions,
        signal,
        userMessageId
      })
    } else {
      message.error('数据状态异常')
    }
  }

  return (
    <div className={styles.chatPage}>
      <ProLayout
        title={import.meta.env.VITE_APP_TITLE}
        logo={import.meta.env.VITE_APP_LOGO}
        layout="mix"
        splitMenus={false}
        contentWidth="Fluid"
        fixedHeader
        fixSiderbar
        contentStyle={{
          height: 'calc(100vh - 56px)',
          background: '#fff'
        }}
        siderMenuType="group"
        style={{
          background: '#fff'
        }}
        menu={{
          hideMenuWhenCollapsed: true,
          locale: false,
          collapsedShowGroupTitle: false
        }}
        suppressSiderWhenMenuEmpty
        siderWidth={300}
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
        avatarProps={{
          src: 'https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
          size: 'small',
          title: user_detail?.account,
          render: (props, dom) => {
            // 可以在这里做一些处理
            if (!token)
              return (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setGoodsPayOptions({ open: true })
                      //   setLoginOptions({ open: true })
                    }}
                  >
                    登录 / 注册
                  </Button>
                  <a
                    href="https://github.com/79E/ChatGpt-Web"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <GithubFilled
                      style={{
                        fontSize: 32,
                        color: '#333'
                      }}
                    />
                  </a>
                </Space>
              )
            return (
              <Space>
                <Dropdown
                  menu={{
                    items: [
                      // {
                      //   key:'info',
                      //   icon: <CloudSyncOutlined />,
                      //   label: '用户信息',
                      //   onClick: ()=>{

                      //   }
                      // },
                      // {
                      //   key:'yue',
                      //   icon: <CloudSyncOutlined />,
                      //   label: '我的余额',
                      //   onClick: ()=>{

                      //   }
                      // },
                      {
                        key: 'zhifuzhongxin',
                        icon: <CloudSyncOutlined />,
                        label: '支付中心',
                        onClick: () => {
                          setGoodsPayOptions({ open: true })
                        }
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: '退出登录',
                        onClick: () => {
                          logout()
                        }
                      }
                    ]
                  }}
                >
                  {dom}
                </Dropdown>
                <a
                  href="https://github.com/79E/ChatGpt-Web"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <GithubFilled
                    style={{
                      fontSize: 32,
                      color: '#333'
                    }}
                  />
                </a>
              </Space>
            )
          }
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
                  chatGptConfigform.setFieldsValue({
                    ...config
                  })
                  setChatConfigModal({ open: true })
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
        breadcrumbRender={() => []}
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
      </ProLayout>

      {/* 登录注册弹窗 */}
      <Modal
        open={loginOptions.open}
        footer={null}
        destroyOnClose
        onCancel={() => setLoginOptions({ open: false })}
      >
        <LoginForm<RequestLoginParams>
          form={loginForm}
          logo={import.meta.env.VITE_APP_LOGO}
          title=""
          subTitle="全网最便宜的人工智能对话"
          actions={
            <Space>
              <HeartFilled />
              <RedditCircleFilled />
              <SlackCircleFilled />
              <TwitterCircleFilled />
            </Space>
          }
          contentStyle={{
            width: 'auto',
            minWidth: '100px'
          }}
          onFinish={async (e) => {
            return new Promise((resolve, reject) => {
              fetchLogin({ ...e })
                .then((res) => {
                  if (res.status) {
                    reject(false)
                    return
                  }
                  setLoginOptions({ open: false })
                  resolve(true)
                })
                .catch(() => {
                  reject(false)
                })
            })
          }}
        >
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined className={'prefixIcon'} />
            }}
            name="account"
            placeholder="邮箱或手机号"
            rules={[
              {
                required: true,
                message: '邮箱或手机号'
              }
            ]}
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />
            }}
            captchaProps={{
              size: 'large'
            }}
            placeholder={'请输入验证码'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`
              }
              return '获取验证码'
            }}
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码！'
              }
            ]}
            onGetCaptcha={async () => {
              const account = loginForm.getFieldValue('account')
              return new Promise((resolve, reject) =>
                getCode({ account })
                  .then(() => resolve())
                  .catch(reject)
              )
            }}
          />
          <div
            style={{
              marginBlockEnd: 24
            }}
          />
        </LoginForm>
      </Modal>

      {/* 配置弹窗 */}
      <ModalForm<ChatGptConfig>
        title="Chat 配置"
        open={chatConfigModal.open}
        form={chatGptConfigform}
        onOpenChange={(visible) => {
          setChatConfigModal({ open: visible })
        }}
        onFinish={async (values) => {
          changeConfig(values)
          return true
        }}
        size="middle"
        width={600}
        modalProps={{
          cancelText: '取消',
          okText: '提交',
          maskClosable: false,
          destroyOnClose: true
        }}
      >
        <FormItemCard title="GPT模型" describe="根据OpenAI中给出的模型配置">
          <ProFormSelect
            name="model"
            style={{ minWidth: '180px' }}
            options={[...models]}
            fieldProps={{
              clearIcon: false
            }}
          />
        </FormItemCard>
        <FormItemCard title="代理API" describe="代理地址可以是任何三方代理（ChatGpt）">
          <ProFormText
            allowClear={false}
            name="api"
            placeholder="请输入代理地址"
            rules={[{ required: true, message: '请填写代理API地址' }]}
          />
        </FormItemCard>
        <FormItemCard title="API Key" describe="使用自己的OpenApiKey 或者其他代理。">
          <ProFormText allowClear={false} name="api_key" placeholder="请输入key 密钥" />
        </FormItemCard>
        <FormItemCard title="携带历史消息数" describe="每次请求携带的历史消息数">
          <ProFormSlider name="limit_message" max={10} min={0} step={1} />
        </FormItemCard>
        <FormItemCard title="随机性" describe="值越大，回复越随机，大于 1 的值可能会导致乱码">
          <ProFormSlider name="temperature" max={2} min={-2} step={0.1} />
        </FormItemCard>
        <FormItemCard title="话题新鲜度" describe="值越大，越有可能扩展到新话题">
          <ProFormSlider name="presence_penalty" max={2} min={-2} step={0.1} />
        </FormItemCard>
        <FormItemCard title="重复性" describe="文本中重复单词和短语的频率，越大越不流畅">
          <ProFormSlider name="frequency_penalty" max={2} min={-2} step={0.1} />
        </FormItemCard>
        <FormItemCard title="单次回复限制" describe="单次交互所用的最大 Token 数">
          <ProFormSlider name="max_tokens" max={10000} min={2000} step={1} />
        </FormItemCard>
      </ModalForm>

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

      {/* 支付中心弹窗 */}
      <GoodsPay
        open={goodsPayOptions.open}
        onClose={() => {
          setGoodsPayOptions({ open: false })
        }}
      />
    </div>
  )
}
export default ChatPage
