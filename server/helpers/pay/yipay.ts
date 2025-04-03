import fetch from 'node-fetch'
import querystring from 'querystring'
import { ksort, buildQueryString, filterObjectNull, generateMd5 } from '../../utils'

type Base = {
  api: string
  key: string
}

async function precreate(base: Base, config, options) {
  const data = filterObjectNull({
    device: 'pc',
    ...config,
    ...options
  })
  const sortedData = ksort(data)
  const query = buildQueryString(sortedData)
  const sign = generateMd5(query + base.key)
  console.log(sign)
  const formBody = querystring.stringify({
    sign,
    sign_type: 'MD5',
    ...data
  })
  const api = base.api + '/mapi.php'
  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: formBody
  })
  const json = await response.json()
  return {
	...json,
    code: json.code === 1 ? 0 : json.code,
    pay_url: json.payurl || json.qrcode || json.urlscheme,
  }
}

async function checkNotifySign(params, key) {
  const sign = params.sign
  const data = filterObjectNull({
    ...params,
    channel: null,
    sign: null,
    sign_type: null
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
