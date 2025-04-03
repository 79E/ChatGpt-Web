import { Paging } from '../../type'
import productMysql from './mysql'

async function getProducts({ page, page_size }: Paging, where?: { [key: string]: any }) {
  const finds = await productMysql.findAndCountAll({
    where,
    order: [['create_time', 'DESC']],
    offset: page * page_size,
    limit: page_size
  })
  return finds
}

async function getProduct(id) {
  const find = await productMysql.findByPk(id)
  if (!find) return null
  return find.toJSON()
}

async function delProduct(id) {
  const del = await productMysql.destroy({
    where: {
      id
    }
  })
  return del
}

async function addProduct(data: { [key: string]: any }) {
  const add = await productMysql.create(data)
  return add
}

async function editProduct(data: { [key: string]: any }) {
  const edit = await productMysql.upsert(data)
  return edit
}

export default {
  getProducts,
  delProduct,
  addProduct,
  editProduct,
  getProduct
}
