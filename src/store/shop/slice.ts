import { ProductInfo } from '@/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface shopState {
  // 商品列表
  goodsList: Array<ProductInfo>
  // 修改商品列表
  changeGoodsList: (list: Array<ProductInfo>) => void
}

const shopStore = create<shopState>()(
  persist(
    (set, get) => ({
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
