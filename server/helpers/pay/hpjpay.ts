import fetch from 'node-fetch'
import querystring from 'querystring'
import { ksort, buildQueryString, filterObjectNull, generateMd5 } from '../../utils'

type Base = {
  api: string
  key: string
}

async function precreate(base: Base, options) {
  const data = filterObjectNull({
    device: 'pc',
    ...options
  })
  const sortedData = ksort(data)
  const query = buildQueryString(sortedData)
  const sign = generateMd5(query + base.key)
  const formBody = querystring.stringify({
    hash: sign,
    ...data
  })
  const api = base.api + '/payment/do.html'
  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: formBody
  })
  const json = await response.json()
  console.log('支付返回：json', json)
  return {
    code: json.code === 1 ? 0 : json.code,
    pay_url: json?.qrcode || json.url || json.url_qrcode
  }
}

async function checkNotifySign(params, key) {
  const sign = params.hash
  const data = filterObjectNull({
    ...params,
    channel: null,
    hash: null,
  })
  const sortedData = ksort(data)
  const query = buildQueryString(sortedData)
  const newSign = generateMd5(query + key)
  return sign === newSign
}

export default {
  precreate,
  checkNotifySign
}
