import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ResponseLoginData, UserInfo } from '@/types'

export interface userState {
  // 登录弹窗开关
  loginModal: boolean
  // 用户信息
  user_info: UserInfo | undefined
  // 登陆Token
  token: string | undefined
  // 修改登录弹窗
  setLoginModal: (value: boolean) => void
  // 登陆
  login: (data: ResponseLoginData) => void
  // 退出
  logout: () => void
}

const userStore = create<userState>()(
  persist(
    (set, get) => ({
      loginModal: false,
      user_info: undefined,
      token: undefined,
      setLoginModal: (value) => set({ loginModal: value }),
      login: (data) => set(() => ({ ...data })),
      logout: () => set(() => ({ user_info: undefined, token: undefined }))
    }),
    {
      name: 'user_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default userStore
