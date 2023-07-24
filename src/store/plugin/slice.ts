import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PluginInfo } from '@/types'

export interface PluginState {
  // 配置信息
  plugins: Array<PluginInfo>
  changePlugin: (list: Array<PluginInfo>) => void,
  changeIsInstalled: (data: {id: string | number, type: 'install' | 'uninstall'}) => void,
}

const pluginStore = create<PluginState>()(
  persist(
    (set, get) => ({
      plugins: [],
      changePlugin: (list) => set((state: PluginState) => ({ plugins: [...list] })),
      changeIsInstalled: ({id, type}) => set((state: PluginState)=> {
        const plugins = state.plugins.map((item)=>{
          const info = {
            ...item
          }
          if(item.id === id && type === 'install') {
            info.installed = true
          }

          if(item.id === id && type === 'uninstall') {
            info.installed = false
          }
          return {
            ...info
          }
        });
        
        return {
          plugins
        }
      })
    }),
    {
      name: 'plugin_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default pluginStore
