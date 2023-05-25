import { getProduct } from '@/request/api'
import shopStore from './slice'

async function fetchProduct() {
  const res = await getProduct()
  if (!res.code) {
    shopStore.getState().changeGoodsList([...res.data.products])
	const payTyps = res.data.pay_types.map((type) => {
		const types: {[key: string]: any} = {
			wxpay: {
				icon: 'https://files.catbox.moe/b1joiq.png',
				title: '微信支付',
				key: 'wxpay'
			},
			alipay: {
				icon: 'https://files.catbox.moe/a8x6il.png',
				title: '支付宝',
				key: 'alipay'
			},
			qqpay: {
				icon: 'https://files.catbox.moe/rimuzz.png',
				title: 'QQ支付',
				key: 'qqpay'
			},
		}
		return types[type]
	})
	await shopStore.getState().changePayTypes([...payTyps])
  }
  return res
}

export default {
  fetchProduct
}
