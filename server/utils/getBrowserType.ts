export default function getBrowserType(ua?: string) {
    if(!ua) return 'pc'
    if (/AlipayClient/.test(ua)) {
        return 'alipay';
    } else if (/MicroMessenger/.test(ua)) {
        return 'wechat';
    } else if (/QQ\//.test(ua)) {
        return 'qq';
    } else if (/Mobile/.test(ua)) {
        return 'mobile';
    } else {
        return 'pc';
    }
}