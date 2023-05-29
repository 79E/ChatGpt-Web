import { getConfig } from '@/request/api'
import configStore from './slice'

async function fetchConfig() {
  const res = await getConfig()
  if (!res.code) {
	configStore.getState().replaceData(res.data)
  }
  return res
}

export default {
  fetchConfig
}
