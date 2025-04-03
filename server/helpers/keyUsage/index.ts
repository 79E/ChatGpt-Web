import fetch from 'node-fetch'
import { formatTime } from '../../utils'

async function openai(host: string, key: string) {
  const subscriptionUrl = `${host}/v1/dashboard/billing/subscription`
  const subscriptionRes = await fetch(subscriptionUrl, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + key
    }
  })

  if (subscriptionRes.status !== 200) {
    return {
      status: subscriptionRes.status,
      hard_limit_usd: 0,
      total_usage: 0
    }
  }

  const data = await subscriptionRes.json()
  const hard_limit_usd = data?.hard_limit_usd || 0
  const now = new Date()
  const usageUrl = `${host}/v1/dashboard/billing/usage`
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const usageres = await fetch(
    `${usageUrl}?start_date=${formatTime('yyyy-MM-dd', new Date(startDate))}&end_date=${formatTime(
      'yyyy-MM-dd',
      new Date(endDate)
    )}`,
    {
      headers: {
        Authorization: 'Bearer ' + key
      }
    }
  )

  let total_usage: string | number = 0
  if (usageres.status === 200) {
    const usageData = await usageres.json()
    total_usage = usageData.total_usage ? (usageData.total_usage / 100).toFixed(2) : 0
  }
  return {
    status: 0,
    hard_limit_usd,
    total_usage
  }
}

async function stability(host: string, key: string) {
  const response = await fetch(`${host}/v1/user/balance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
    },
  })
  if (!response.ok || response.status !== 200) {
      return {
        status: -1,
        hard_limit_usd: 0,
        total_usage: 0
    }
  }
  const { credits } = await response.json()
  return {
      status: 0,
      hard_limit_usd: credits,
      total_usage: 0
  }
}

function keyUsage(aikeyInfo) {
    const { host, key, type } = aikeyInfo;
    if(type === 'openai'){
        return openai(host, key)
    }else if(type === 'stability'){
        return stability(host, key,)
    }

    return {
        status: -1,
        hard_limit_usd: 0,
        total_usage: 0
    }
}

export default keyUsage;
