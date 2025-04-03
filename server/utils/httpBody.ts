export type HttpBody<T = any> = {
  code?: number
  message?: string
  data?: T
}

function httpBody(code: number): HttpBody
function httpBody<T>(code: number, data: T): HttpBody<T>
function httpBody<T>(code: number, data: T, message: string): HttpBody<T>
function httpBody(code: number, message: string): HttpBody

function httpBody<T = any>(code: number, ...rest: Array<number | string | T>): HttpBody {
  const body: HttpBody = {
    code,
    data: [],
    message: ''
  }
  if (rest.length === 1 && typeof rest[0] === 'string') {
    body.message = rest[0]
  } else if (rest.length === 2 && typeof rest[0] !== 'string' && typeof rest[1] === 'string') {
    body.data = rest[0]
    body.message = rest[1]
  } else if (rest.length === 1 && typeof rest[0] !== 'string') {
    body.data = rest[0]
  }
  return body
}

export default httpBody
