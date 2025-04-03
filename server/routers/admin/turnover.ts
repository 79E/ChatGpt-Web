import express from 'express'
import { httpBody, pagingData } from '../../utils'
import { turnoverModel } from '../../models'
const router = express.Router()

router.get('/turnover', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const carmis = await turnoverModel.getTurnovers({ page, page_size })
    res.json(httpBody(0, carmis))
})

router.delete('/turnover/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await turnoverModel.delTurnover(id)
    res.json(httpBody(0, delRes))
})

router.put('/turnover', async function (req, res, next) {
    const { id, user_id, value, describe } = req.body;
    if (!id || !value || !describe || !user_id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await turnoverModel.editTurnover({
        id,
        value,
        describe,
        user_id
    })
    res.json(httpBody(0, delRes))
})

export default router

