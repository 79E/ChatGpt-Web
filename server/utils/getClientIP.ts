export default function getClientIP(req: any) {
  let ip: string =
    (req.headers['x-forwarded-for'] as string) ||
    (req.headers['x-real-ip'] as string) ||
    (req.headers['remote-host'] as string) ||
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.ip ||
    ''

  if (ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip
}
