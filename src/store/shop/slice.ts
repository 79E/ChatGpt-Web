import { PayTypeInfo, ProductInfo } from '@/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface shopState {
  // pay 支付方式
  payTypes: Array<PayTypeInfo>
  // 商品列表
  goodsList: Array<ProductInfo>
  // 修改商品列表
  changeGoodsList: (list: Array<ProductInfo>) => void
  // 修改支付方式
  changePayTypes: (list: Array<PayTypeInfo>) => void
}

const shopStore = create<shopState>()(
  persist(
    (set, get) => ({
      payTypes: [],
      changePayTypes: (list) => set({ payTypes: list }),
      goodsList: [],
      changeGoodsList: (list) => set({ goodsList: list })
    }),
    {
      name: 'shop_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default shopStore
