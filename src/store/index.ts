import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  ChatGpt,
  ChatGptConfig,
  ChatsInfo,
  ImagesInfo,
  ProductInfo,
  PromptInfo,
  ResponseLoginData,
  UserDetail
} from '@/types'
import { formatTime, generateChatInfo } from '@/utils'
import promptszh from '@/assets/prompts-zh.json'
export interface State {
  // 登录弹窗开关
  loginModal: boolean
  // 配置弹窗开关
  configModal: boolean
  // 模型
  models: Array<{
    label: string
    value: string
  }>
  // 用户信息
  user_detail: UserDetail | undefined
  // 登陆Token
  token: string | undefined
  // 配置信息
  config: ChatGptConfig
  // 本地角色
  localPrompt: Array<PromptInfo>
  // 历史绘画数据
  historyDrawImages: Array<ImagesInfo>
  // 商品列表
  goodsList: Array<ProductInfo>
  // 修改登录弹窗
  setLoginModal: (value: boolean) => void
  // 修改配置弹窗
  setConfigModal: (value: boolean) => void
  // 修改配置
  changeConfig: (config: ChatGptConfig) => void
  // 新增角色
  addPrompts: (list: Array<PromptInfo>) => void
  // 清除所有角色
  clearPrompts: () => void
  // 删除单个角色
  delPrompt: (info: PromptInfo) => void
  // 编辑角色信息
  editPrompt: (oldKey: string, info: PromptInfo) => void
  // 聊天对话
  chats: Array<ChatsInfo>
  // 登陆
  login: (data: ResponseLoginData) => void
  // 退出
  logout: () => void
  // 新增一个对话
  addChat: () => void
  // 删除一个对话
  delChat: (id: string | number) => void
  // 清空所有对话
  clearChats: () => void
  // 当前选择的会话id
  selectChatId: string | number
  changeSelectChatId: (id: string | number) => void
  // 给对话添加数据
  setChatInfo: (
    id: string | number,
    info?: ChatsInfo | { [key: string]: any },
    data?: ChatGpt
  ) => void
  // 修改对话数据
  setChatDataInfo: (
    id: string | number,
    messageId: string | number,
    info?: ChatGpt | { [key: string]: any }
  ) => void
  // 清理当前会话
  clearChatMessage: (id: string | number) => void
  // 删除某条消息
  delChatMessage: (id: string | number, messageId: string | number) => void
  // 清除历史绘画数据
  clearhistoryDrawImages: () => void
  // 新增绘画数据
  addDrawImage: (images: Array<ImagesInfo>) => void
  // 修改商品列表
  changeGoodsList: (list: Array<ProductInfo>) => void
}

const useStore = create<State>()(
  persist(
    (set, get) => ({
      loginModal: false,
      configModal: false,
      user_detail: undefined,
      token: undefined,
      historyDrawImages: [],
      models: [
        {
          label: 'GPT-3.5',
          value: 'gpt-3.5-turbo'
        },
        {
          label: 'GPT-4',
          value: 'gpt-4'
        }
        // {
        //   label: 'GPT-4-0314',
        //   value: 'gpt-4-0314'
        // },
        // {
        //   label: 'GPT-4-32k',
        //   value: 'gpt-4-32k'
        // },
        // {
        //   label: 'TEXT-002',
        //   value: 'text-davinci-002'
        // },
        // {
        //   label: 'TEXT-003',
        //   value: 'text-davinci-003'
        // },
        // {
        //   label: 'CODE-002',
        //   value: 'code-davinci-002'
        // }
      ],
      config: {
        model: 'gpt-3.5-turbo',
        temperature: 0,
        presence_penalty: 0,
        frequency_penalty: 0,
        limit_message: 4,
        max_tokens: 2000,
        api: 'https://api.openai.com',
        api_key: ''
      },
      localPrompt: [...promptszh],
      chats: [],
      selectChatId: '',
      goodsList: [],
      changeGoodsList: (list) => set({ goodsList: list }),
      clearhistoryDrawImages: () => set({ historyDrawImages: [] }),
      addDrawImage: (images) =>
        set((state: State) => {
          const newData = [...state.historyDrawImages, ...images]
          return {
            historyDrawImages: [...newData]
          }
        }),
      setLoginModal: (value) => set({ loginModal: value }),
      setConfigModal: (value) => set({ configModal: value }),
      delChatMessage: (id, messageId) =>
        set((state: State) => {
          const newChats = state.chats.map((c) => {
            if (c.id === id) {
              const newData = c.data.filter((d) => d.id !== messageId)
              return {
                ...c,
                data: newData
              }
            }
            return c
          })
          return {
            chats: newChats
          }
        }),
      clearChatMessage: (id) =>
        set((state: State) => {
          const newChats = state.chats.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                parentMessageId: '',
                data: [],
                text: '',
                dateTime: formatTime()
              }
            }
            return c
          })
          return {
            chats: newChats
          }
        }),
      setChatInfo: (id, info, data) =>
        set((state: State) => {
          const newChats = state.chats.map((item) => {
            if (item.id === id) {
              const name = item.data.length <= 0 && data?.text ? data.text : item.name
              return {
                ...item,
                name,
                ...info,
                data: data ? item.data.concat({ ...data }) : item.data
              }
            }
            return item
          })
          return {
            chats: newChats
          }
        }),
      setChatDataInfo: (id, messageId, info) =>
        set((state: State) => {
          const newChats = state.chats.map((item) => {
            if (item.id === id) {
              const newData = item.data.map((m) => {
                if (m.id === messageId) {
                  return {
                    ...m,
                    ...info
                  }
                }
                return m
              })

              const dataFilter = newData.filter((d) => d.id === messageId)
              const chatData = { id: messageId, ...info } as ChatGpt
              return {
                ...item,
                data: dataFilter.length <= 0 ? [...newData, { ...chatData }] : [...newData]
              }
            }
            return item
          })

          return {
            chats: newChats
          }
        }),
      addChat: () =>
        set((state: State) => {
          const info = generateChatInfo()
          const newChats = [...state.chats]
          newChats.unshift({ ...info })
          return {
            chats: [...newChats],
            selectChatId: info.id
          }
        }),
      delChat: (id) =>
        set((state: State) => {
          const newChats = state.chats.filter((c) => c.id !== id)
          if (state.chats.length <= 1) {
            const info = generateChatInfo()
            return {
              chats: [{ ...info }],
              selectChatId: info.id
            }
          }
          return {
            selectChatId: state.chats[1].id,
            chats: [...newChats]
          }
        }),
      clearChats: () =>
        set(() => {
          const info = generateChatInfo()
          return {
            chats: [{ ...info }],
            selectChatId: info.id
          }
        }),
      changeSelectChatId: (id) =>
        set(() => ({
          selectChatId: id
        })),
      login: (data) => set(() => ({ ...data })),
      logout: () => set(() => ({ user_detail: undefined, token: undefined })),
      changeConfig: (config) => set((state: State) => ({ config: { ...state.config, ...config } })),
      addPrompts: (list) =>
        set((state: State) => {
          const resultMap = new Map()
          state.localPrompt.forEach((item) => resultMap.set(item.key, item))
          list.forEach((item) => resultMap.set(item.key, item))
          return {
            localPrompt: [...Array.from(resultMap.values())]
          }
        }),
      clearPrompts: () => set({ localPrompt: [] }),
      editPrompt: (oldKey, info) =>
        set((state: State) => {
          const newList = state.localPrompt.map((item) => {
            if (oldKey === item.key) {
              return {
                ...info
              }
            }
            return {
              ...item
            }
          })
          return {
            localPrompt: [...newList]
          }
        }),
      delPrompt: (info) =>
        set((state: State) => {
          const newList = state.localPrompt.filter(
            (item) => item.key !== info.key && item.value !== info.value
          )
          return {
            localPrompt: [...newList]
          }
        })
    }),
    {
      name: 'storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default useStore
