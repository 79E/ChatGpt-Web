import { getPlugin } from '@/request/api'
import pluginStore from './slice'

async function fetchGetPlugin() {
  const res = await getPlugin()
  if (!res.code) {
    pluginStore.getState().changePlugin(res.data)
  }
  return res
}

export default {
  fetchGetPlugin
}
