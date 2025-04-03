import { Paging } from '../../type'
import { sequelize } from '../db'
import paymentMysql from './mysql'

async function getOnePayment(type) {
  const find = await paymentMysql
    .findOne({
      where: {
        status: 1,
        [sequelize.Op.or]: [
          { types: { [sequelize.Op.like]: `${type},%` } }, // 匹配以 "alipay," 开头的值
          { types: { [sequelize.Op.like]: `%,${type}` } }, // 匹配以 ",alipay" 结尾的值
          { types: { [sequelize.Op.like]: `%,${type},%` } }, // 匹配以 ",alipay," 包围的值
          { types: { [sequelize.Op.eq]: type } } // 匹配完全等于 "alipay" 的值
        ]
      },
      order: sequelize.literal('RAND()')
    })
    .then((info) => info?.toJSON())
  return find
}

async function getPayments({ page, page_size }: Paging, where?: { [key: string]: any }) {
  const finds = await paymentMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function delPayment(id) {
  const del = await paymentMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addPayment(data: { [key: string]: any }) {
  const add = await paymentMysql.create(data)
  return add
}

async function editPayment(data: { [key: string]: any }) {
  const edit = await paymentMysql.upsert(data)
  return edit
}

async function getPaymentInfo(id) {
  const find = await paymentMysql.findByPk(id)
  if (!find) return null
  return find.toJSON()
}

async function getPaymentTypes() {
	const payments = await paymentMysql.findAll({
		where: {
			status: 1
		}
	})

	let payTypes = []
	for (const payment of payments) {
		const json = payment.toJSON()
		const types = json.types.split(',')
		payTypes = payTypes.concat(types)
	}

	return [...new Set([...payTypes])]
}

export default {
  getOnePayment,
  getPayments,
  delPayment,
  addPayment,
  editPayment,
  getPaymentInfo,
  getPaymentTypes
}
