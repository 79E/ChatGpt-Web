import express from 'express'
import { filterObjectNull, formatTime, generateMd5, generateNowflakeId, generateUUID, httpBody, pagingData } from '../../utils'
import { cashbackModel, amountDetailsModel } from '../../models'
const router = express.Router()

router.get('/cashback', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const data = await cashbackModel.getCashback({ page, page_size })
    res.json(httpBody(0, data))
})

router.delete('/cashback/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await cashbackModel.delCashback(id)
    res.json(httpBody(0, delRes))
})

router.put('/cashback', async function (req, res, next) {
    const { id, status, remarks } = req.body
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await cashbackModel.editCashback(id, filterObjectNull({
        status, remarks
    }))
    res.json(httpBody(0, editRes))
})

router.put('/cashback/pass', async function (req, res, next) {
    const { id } = req.body
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }

    const cashbackInfo = await cashbackModel.getCashbackInfo({
        id
    })
    const { benefit_id, commission_amount, order_id, status } = cashbackInfo || {}
    if(status !== 3){
        res.status(500).json(httpBody(-1, '已经审核通过'))
        return
    }
    const userAmountDetails = await amountDetailsModel.getAmountDetail({
        user_id: benefit_id, 
        status: 1,
    })
    const amountDetailId = generateNowflakeId(1)()
    const insertData = {
        id: amountDetailId,
        status: 1,
        user_id: benefit_id,
        type: 'cashback',
        correlation_id: order_id,
        operate_amount: commission_amount,
        current_amount: commission_amount,
        remarks: '消费提成',
        original_amount: 0
    }
    if(userAmountDetails){
        insertData.original_amount = userAmountDetails.current_amount
        insertData.current_amount = Number(userAmountDetails.current_amount) + Number(commission_amount)
    }
    await amountDetailsModel.addAmountDetails(insertData)
    await cashbackModel.editCashback(id, {
        status: 1,
        remarks: '提成下发成功'
    })
    res.json(httpBody(0))
})

export default router