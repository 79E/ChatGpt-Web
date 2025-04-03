import fetch from 'node-fetch'
import querystring from 'querystring'
import crypto from 'crypto'
import { httpBody } from '../../utils'

export function sendSms({ user, password, content, phone }: {
    user: string,
    password: string,
    content: string,
    phone: string
}) {
	const md5 = crypto.createHash('md5')
    const passwordMD5 = md5.update(password).digest('hex')
    const data = {
        'u': user,
        'p': passwordMD5,
        'm': phone,
        'c': content
    }

    const stringify = querystring.stringify(data);
    return fetch(`https://api.smsbao.com/sms?${stringify}`).then(statusStr).catch(() => httpBody(-5, '短信服务异常，请稍后重试'))
}

async function statusStr(result) {
    const data = await result.json()
    const statusMap = {
        '0': '短信发送成功',
        '-1': '短信发送参数不全',
        '-2': '服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！',
        '30': '短信发送参数不全',
        '40': '账户不存在',
        '41': '余额不足',
        '42': '账户已过期',
        '43': 'IP地址限制',
        '50': '内容含有敏感字'
    };
    return httpBody(data, statusMap[data] || '短信异常错误码');
}
