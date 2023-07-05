import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { PersonaInfo } from '@/types'

export interface PersonaState {
  // AI角色
  personas: Array<PersonaInfo>
  // 新增AI角色
  changePersonas: (list: Array<PersonaInfo>) => void
}

const personaStore = create<PersonaState>()(
  persist(
    (set, get) => ({
      personas: [],
      changePersonas: (list) => set((state: PersonaState) => ({ personas: list }))
    }),
    {
      name: 'persona_storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
)

export default personaStore
