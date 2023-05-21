import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ImagesInfo } from '@/types'

export interface DrawState {
  // 历史绘画数据
  historyDrawImages: Array<ImagesInfo>
  // 清除历史绘画数据
  clearhistoryDrawImages: () => void
  // 新增绘画数据
  addDrawImage: (images: Array<ImagesInfo>) => void
}

const drawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      historyDrawImages: [],
      clearhistoryDrawImages: () => set({ historyDrawImages: [] }),
      addDrawImage: (images) =>
        set((state: DrawState) => {
          const newData = [...state.historyDrawImages, ...images]
          return {
            historyDrawImages: [...newData]
          }
        })
    }),
    {
      name: 'draw_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default drawStore
