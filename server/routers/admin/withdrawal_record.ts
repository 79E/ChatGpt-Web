import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { amountDetailsModel, withdrawalRecordModel } from '../../models'
const router = express.Router()

router.get('/withdrawal_record', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const findAll = await withdrawalRecordModel.getWithdrawalRecords({ page, page_size })
    res.json(httpBody(0, findAll))
})

router.delete('/withdrawal_record/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await withdrawalRecordModel.delWithdrawalRecord(id)
    res.json(httpBody(0, delRes))
})

router.post('/withdrawal_record', async function (req, res, next) {
    const { user_id, amount, type, name, contact, account } = req.body
    if (!user_id || !amount || !type || !name || !contact || !account) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
	const id = generateNowflakeId(1)()
    const editRes = await withdrawalRecordModel.addWithdrawalRecord(filterObjectNull({
		...req.body,
		id
    }))
    res.json(httpBody(0, editRes))
})

router.put('/withdrawal_record', async function (req, res, next) {
    const { id } = req.body
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await withdrawalRecordModel.editWithdrawalRecord(id, filterObjectNull({
		...req.body
    }))
    res.json(httpBody(0, editRes))
})

router.put('/withdrawal_record/operate', async function (req, res, next) {
    const { id, status, remarks } = req.body
    if (!id || !remarks) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }

	if(String(status) === '0') {
		// 提现失败
		// 向用户余额中 返回额度
		const { amount, user_id } = await withdrawalRecordModel.getWithdrawalRecord({
			id
		})
		const userAmountDetails = await amountDetailsModel.getAmountDetail({
			user_id: user_id,
			status: 1,
		})
		const amountId = generateNowflakeId(1)()
		await amountDetailsModel.addAmountDetails({
			user_id,
			operate_amount: amount,
			original_amount: userAmountDetails.current_amount,
			current_amount: Number(userAmountDetails.current_amount) + Number(amount),
			remarks: '提成失败',
			status: 1,
			type: 'withdrawal',
			id: amountId,
			correlation_id: id,
		})
	}

    const editRes = await withdrawalRecordModel.editWithdrawalRecord(id, filterObjectNull({
		status, remarks
    }))
    res.json(httpBody(0, editRes))
})

export default router

