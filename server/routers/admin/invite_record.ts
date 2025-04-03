import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { inviteRecordModel, turnoverModel, userModel } from '../../models'
import { inviteRecordPassQueue } from '../../helpers/queue'
const router = express.Router()

router.get('/invite_record', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const findAll = await inviteRecordModel.getInviteRecords({ page, page_size })
    res.json(httpBody(0, findAll))
})

router.delete('/invite_record/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await inviteRecordModel.delInviteRecord(id)
    res.json(httpBody(0, delRes))
})

router.put('/invite_record', async function (req, res, next) {
    const { id, status, remarks } = req.body
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await inviteRecordModel.editInviteRecord(id, filterObjectNull({
        status, remarks
    }))
    res.json(httpBody(0, editRes))
})

router.put('/invite_record/pass', async function (req, res, next) {
    const { id } = req.body
    if (!id) {
        const all = await inviteRecordModel.getInviteRecordAll({ status: 3 })
        all.map((item)=>{
            const json = item.toJSON()
            inviteRecordPassQueue.addTask({
                ...json
            })
        })
    } else {
        const inviteRecordInfo = await inviteRecordModel.getInviteRecord({ id });
        if(!inviteRecordInfo){
            res.json(httpBody(-1, '邀请记录异常'))
            return
        }

        const { superior_id, reward, reward_type } = inviteRecordInfo;
        inviteRecordPassQueue.addTask({
            id, superior_id, reward, reward_type, ...inviteRecordInfo
        })
    }
    res.json(httpBody(0, '操作成功'))
})

export default router

