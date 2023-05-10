import { ChatGptConfig } from '@/types'

export function getAiKey(config: ChatGptConfig) {
  if (config.api && config.api_key) {
    return {
      api: config.api,
      api_key: config.api_key
    }
  }

  const api = import.meta.env.VITE_APP_AI_BASE_URL || undefined
  const keys = import.meta.env.VITE_APP_AI_KEYS.split(',')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0)
  const api_key = keys[Math.floor(Math.random() * keys.length)]

  return {
    api,
    api_key
  }
}
