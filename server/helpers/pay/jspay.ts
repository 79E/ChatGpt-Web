import fetch from 'node-fetch'
import querystring from 'querystring'
import { ksort, buildQueryString, filterObjectNull, generateMd5 } from '../../utils'

type Base = {
  api: string
  key: string
}

async function precreate(base: Base, options) {
  const data = filterObjectNull({
    ...options
  })
  const sortedData = ksort(data)
  const query = buildQueryString({ ...sortedData, key: base.key })
  const sign = generateMd5(query).toUpperCase()
  const formBody = querystring.stringify({
    sign,
    ...data
  })
  const api = base.api + '/api/native'
  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: formBody
  })
  const json = await response.json()
  return {
    code: json.return_code === 1 ? 0 : 500,
    qrcode: json.code_url || json.qrcode,
    message: json.return_msg
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
  const query = buildQueryString({ ...sortedData, key })
  const newSign = generateMd5(query).toUpperCase()
  return sign === newSign
}

export default {
  precreate,
  checkNotifySign
}
