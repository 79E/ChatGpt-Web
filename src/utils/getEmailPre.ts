export function getEmailPre(str?: string) {
  if (!str) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // 邮箱正则表达式
  if (emailRegex.test(str)) {
    // 如果是邮箱，则返回@前的字符串
    return str.split('@')[0]
  } else {
    // 如果不是邮箱，则返回整个字符串
    return str
  }
}
