import nodemailer, { SendMailOptions } from 'nodemailer'
import { httpBody } from '../../utils'
import { HttpBody } from '../../utils/httpBody'

// 用 Promise 包装发送邮件的操作
const sendMailPromise = (transporter, opts: SendMailOptions) => {
  return new Promise<HttpBody>((resolve, reject) => {
    transporter.sendMail(opts, (err, resp) => {
      if (err) {
        reject(httpBody(-1, '邮件服务配置错误'))
      } else {
        resolve(httpBody(0, '邮件发送成功'))
      }
    })
  })
}

export function sendMail(
  {
    to,
    body,
    options,
    fromTitle = 'ChatGpt',
    subject = '通知邮件',
  }: {
    to: string,
    body: string,
    fromTitle?: string,
    subject?: string,
    options: {
      auth: {
        user: string,
        pass: string
      },
      [key: string]: string | number | boolean | { [key: string]: string }
    }
  }
) {

  const secure = Number(options.port) === 465 ? true : false;
  const transporter = nodemailer.createTransport({
    secure,
    ignoreTLS: true,
    ...options,
  })

  const baseOptions: SendMailOptions = {
    from: `"${fromTitle}" <${options.auth.user}>`,
    to,
    subject,
    html: body,
  }

  return sendMailPromise(transporter, baseOptions);
}

