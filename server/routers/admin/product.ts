import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { productModel } from '../../models'
const router = express.Router()

router.get('/products', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const signins = await productModel.getProducts({ page, page_size })
    res.json(httpBody(0, signins))
})

router.delete('/products/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await productModel.delProduct(id)
    res.json(httpBody(0, delRes))
})

router.post('/products', async function (req, res, next) {
    const { title, price, original_price, value, badge, type, level, describe, status, sort } = req.body;
    if (!title || !price || !value || !type || !sort) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const id = generateNowflakeId(1)()
    const addRes = await productModel.addProduct(filterObjectNull({
        id,
        title, price, original_price, value, type, badge, level, describe, status,sort
    }))
    res.json(httpBody(0, addRes))
})

router.put('/products', async function (req, res, next) {
    const { id, title, price, original_price, value, badge, type, level, describe, status,sort } = req.body;
    console.log(req.body)
    if (!id || !title || !price || !value || !type || !sort) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await productModel.editProduct({
        id,
        title, price, original_price, value, badge, type, level, describe, status, sort
    })
    res.json(httpBody(0, editRes))
})


export default router

