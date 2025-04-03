import AlipaySdk from 'alipay-sdk'
import { filterObjectNull } from '../../utils'

type Config = {
  appId: string
  keyType: 'PKCS1' | 'PKCS8' | undefined
  privateKey: string
  alipayPublicKey: string
}

type GoodsDetail = {
  goods_id: string | number
  goods_name: string
  quantity: number
  price: number | string
}

type Response = {
  outTradeNo: string
  qrCode: string
}

export async function precreate({
  config,
  notify_url,
  out_trade_no,
  total_amount,
  subject,
  body,
  goods_detail
}: {
  config: Config // 支付配置
  notify_url: string // 回调地址
  out_trade_no: string // 商户订单编号
  total_amount: string | number // 支付金额（元）
  subject: string // 商品标题
  body: string
  goods_detail: GoodsDetail
}) {
  const alipaySdk = new AlipaySdk(config)
  const response = await alipaySdk.exec<Response>('alipay.trade.precreate', {
    notify_url: notify_url, // 支付完成通知地址
    bizContent: {
      out_trade_no,
      subject,
      goods_detail: [goods_detail],
      body,
      total_amount,
      product_code: 'FACE_TO_FACE_PAYMENT'
    } // 业务（API）参数
  })

  return {
    ...response,
    code: response.code === '10000' ? 0 : response.code
  }
}

async function checkNotifySign(config: Config, body: { [key: string]: any }) {
  const alipaySdk = new AlipaySdk(config)
  const data = filterObjectNull({
    ...body,
    channel: null
  })
  return alipaySdk.checkNotifySign(data)
}

export default {
  precreate,
  checkNotifySign
}
