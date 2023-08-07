import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DrawRecord } from '@/types'

export interface DrawState {
  // 历史绘画数据
  historyDrawImages: Array<DrawRecord>,
  galleryDrawImages: Array<DrawRecord>,
  // 清除历史绘画数据
  clearhistoryDrawImages: () => void,
  setHistoryDrawImages: (id: number | string, status?: number) => void,
  // 新增绘画数据
  addDrawImage: (images: Array<DrawRecord>) => void,
  changeDrawImage: (type: 'me' | 'gallery' | string, images: Array<DrawRecord>, index: number) => void
}

const drawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      historyDrawImages: [],
      galleryDrawImages: [],
      setHistoryDrawImages: (id, status) => set((state: DrawState) => {
        let newList = [...state.historyDrawImages]
        if (!status) {
          newList = newList.filter(item => item.id !== id)
        } else {
          newList = newList.map(item => {
            let newStatus = item.status;
            if (item.id === id) {
              newStatus = status
            }
            return {
              ...item,
              status: newStatus
            }
          })
        }
        return {
          historyDrawImages: [...newList]
        }
      }),
      changeDrawImage: (type, images, index) => set((state: DrawState) => {
        if (type === 'me') {
          if (index <= 1) {
            return {
              historyDrawImages: [...images]
            }
          } else {
            const newData = [...state.historyDrawImages, ...images]
            return {
              historyDrawImages: [...newData]
            }
          }
        }

        if (type === 'gallery') {
          if (index <= 1) {
            return {
              galleryDrawImages: [...images]
            }
          } else {
            const newData = [...state.galleryDrawImages, ...images]
            return {
              galleryDrawImages: [...newData]
            }
          }
        }

        return {
          historyDrawImages: [],
          galleryDrawImages: []
        }
      }),
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
