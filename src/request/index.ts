import { notification } from 'antd'
import { userStore } from '@/store'

export type ResponseData<T> = {
  code: number
  data: T
  message: string
}

export type RequestConfig = { timeout?: number }

function isResponseData<T>(obj: any): obj is ResponseData<T> {
  return 'code' in obj && 'data' in obj && 'message' in obj
}

// 判断是否需要基础域名前缀
const getBaseUrl = (url: string) => {
  const baseURL = import.meta.env.VITE_APP_REQUEST_HOST
  if (/^http(s?):\/\//i.test(url)) return url
  return baseURL + url
}

// 对Headers 进行一个变形
function correctHeaders(
  method = 'GET',
  headers: HeadersInit & {
    'Content-Type'?: string
  } = {}
) {
  if (headers['Content-Type'] === 'multipart/form-data') {
    delete headers['Content-Type']
    return headers
  }
  if ((method === 'GET' || method === 'DELETE') && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  if ((method === 'POST' || method === 'PUT') && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

// 判断是否为Object
const isPlainObject = (obj: any) => {
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]' || obj instanceof FormData) {
    return false
  }
  const proto = Object.getPrototypeOf(obj)
  if (!proto) return true
  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && Ctor === Object
}

// 请求拦截器
const interceptorsRequest = (config: { url: string; options?: RequestInit }) => {
  console.log('请求拦截器', config)
  const options = {
    ...config.options,
    headers: {
      ...config.options?.headers,
      token: userStore.getState().token
    }
  }
  return { ...options }
}

// 响应拦截器
const interceptorsResponse = async <T>(options: any, response: any): Promise<ResponseData<T>> => {
  console.log('响应拦截器：', options, response)
  let data: ResponseData<T> = await response.json()

  if (!isResponseData(data)) {
    data = {
      code: response.status === 200 ? 0 : response.status,
      data: (data as any)?.data ? (data as any).data : data,
      message: ''
    }
  }

  if (data.code) {
    if (response.status === 401) {
      userStore.getState().logout()
    }
    if (data.message) {
      notification.error({
        message: '错误',
        description: data.message ? data.message : '网络请求错误',
        style: {
          top: 60,
          zIndex: 1011
        }
      })
    }
  }
  return data
}

// 错误拦截器
const interceptorsErrorResponse = async (data: ResponseData<any>) => {
  notification.error({
    message: '错误',
    description: data.message ? data.message : '网络请求错误',
    style: {
      top: 60,
      zIndex: 1011
    }
  })
}

// 请求
const request = <T>(
  url: string,
  options?: RequestInit | { [key: string]: any },
  config?: RequestConfig
): Promise<ResponseData<T>> => {
  // 超时时间
  const { timeout = 15000 } = config || {}
  let timeoutId: string | number | NodeJS.Timeout | null | undefined = null

  if (typeof url !== 'string') throw new TypeError('url must be required and of string type!')
  url = getBaseUrl(url)

  const controller = new AbortController()
  const signal = controller.signal

  options = {
    method: 'GET',
    // 请求控制器
    signal,
    ...options,
    headers: correctHeaders(options?.method, options?.headers)
  }

  // 导入请求拦截器
  options = interceptorsRequest({
    url,
    options
  })

  // 超时处理
  const timeoutPromise = (timeout: number): Promise<ResponseData<any>> => {
    if (timeout <= 0) {
      return new Promise(() => {
        // ======= 等待 =======
      })
    }
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        const data = { code: 504, data: [], message: '请求超时，请稍后重新尝试。' }
        interceptorsErrorResponse(data)
        controller.abort()
        resolve(data)
      }, timeout)
    })
  }

  // 发送请求
  const fetchPromise: Promise<ResponseData<T>> = new Promise((resolve, reject) => {
    fetch(url, options)
      .then(async (res) => {
        const response = await interceptorsResponse<T>(
          {
            url,
            options
          },
          res
        )
        await resolve(response)
      })
      .catch(async (error) => {
        if (error.name === 'AbortError') {
          // We know it's been canceled!
          return
        }
        const data = { code: 504, data: error, message: '网络异常，请稍后重新尝试。' }
        await interceptorsErrorResponse(data)
        await reject(data)
      })
      .finally(() => {
        timeoutId && clearTimeout(timeoutId)
      })
  })

  return Promise.race([timeoutPromise(timeout), fetchPromise])
}

const get = <T = unknown>(
  url: string,
  params: { [key: string]: any } | string = '',
  headers?: HeadersInit,
  config?: RequestConfig
) => {
  if (params && typeof params !== 'string' && isPlainObject(params)) {
    const tempArray: string[] = []
    for (const item in params) {
      if (item) {
        tempArray.push(`${item}=${params[item]}`)
      }
    }
    params = url.includes('?') ? tempArray.join('&') : `?${tempArray.join('&')}`
  }

  return request<T>(
    `${url}${params}`,
    {
      method: 'GET',
      headers
    },
    config
  )
}

const post = <T = unknown>(
  url: string,
  data?: { [key: string]: any } | string | any,
  headers?: HeadersInit,
  config?: RequestConfig
) => {
  let correctData = data
  if (isPlainObject(data)) {
    correctData = JSON.stringify(data)
  }
  return request<T>(
    url,
    {
      method: 'POST',
      headers,
      body: correctData
    },
    config
  )
}

const put = <T = unknown>(
  url: string,
  data?: { [key: string]: any } | string | any,
  headers?: HeadersInit,
  config?: RequestConfig
) => {
  let correctData = data
  if (isPlainObject(data)) {
    correctData = JSON.stringify(data)
  }
  return request<T>(
    url,
    {
      method: 'PUT',
      headers,
      body: correctData
    },
    config
  )
}

const del = <T = unknown>(
  url: string,
  params: { [key: string]: any } | string = '',
  headers?: HeadersInit,
  config?: RequestConfig
) => {
  if (params && typeof params !== 'string' && isPlainObject(params)) {
    const tempArray: string[] = []
    for (const item in params) {
      if (item) {
        tempArray.push(`${item}=${params[item]}`)
      }
    }
    params = url.includes('?') ? tempArray.join('&') : `?${tempArray.join('&')}`
  }

  return request<T>(
    `${url}${params}`,
    {
      method: 'DELETE',
      headers
    },
    config
  )
}

const postStreams = async <T>(
  url: string,
  data?: { [key: string]: any } | string | any,
  o?: {
    headers?: HeadersInit
    options?: { [key: string]: any }
  }
) => {
  const baseUrl = getBaseUrl(url)
  const options: { [key: string]: any } = interceptorsRequest({
    url,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
      headers: correctHeaders('POST', o?.headers),
      ...o?.options
    }
  })
  const response = await fetch(baseUrl, options)
  if (
    response.headers.has('Content-Type') &&
    response.headers.get('Content-Type')?.includes('application/json')
  ) {
    const responseJson = await interceptorsResponse<T>(
      {
        url,
        options
      },
      response
    )
    return responseJson
  }
  return response
}

export default {
  get,
  post,
  put,
  del,
  postStreams
}
