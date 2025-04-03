import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { drawRecordModel } from '../../models'
const router = express.Router()

router.get('/draw_record', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const list = await drawRecordModel.getDrawRecords({ page, page_size })
    res.json(httpBody(0, list))
})

router.delete('/draw_record/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await drawRecordModel.delDrawRecord(id)
    res.json(httpBody(0, delRes))
})

router.put('/draw_record', async function (req, res, next) {
    const { id, status } = req.body
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await drawRecordModel.editDrawRecord(
        id,
        {
            status
        }
    )
    res.json(httpBody(0, editRes))
})

export default router
