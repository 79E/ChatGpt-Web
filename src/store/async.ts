import store from '.'
import { getProduct, getUserInfo, postLogin } from '@/request/api'
import { RequestLoginParams } from '@/types'

// 需要将请求返回的数据进行持久化的放在这里

// 登录
export async function fetchLogin(params: RequestLoginParams) {
  const response = await postLogin(params)
  if (!response.code) {
    store.getState().login({ ...response.data })
  }
  return response
}

// 获取用户信息
export async function fetchUserInfo() {
  const response = await getUserInfo()
  if (!response.code) {
    store.getState().login({
      token: store.getState().token,
      user_detail: response.data
    })
  }
  return response
}

// 产品列表
export async function fetchProduct() {
  const response = await getProduct()
  if (!response.code) {
    store.getState().changeGoodsList(response.data)
  }
  return response
}
