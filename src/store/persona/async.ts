import { getPersonas } from '@/request/api'
import personaStore from './slice'

async function fetchPersonas() {
  const res = await getPersonas()
  if (!res.code) {
    personaStore.getState().changePersonas([...res.data])
  }
  return res
}

export default {
  fetchPersonas
}
