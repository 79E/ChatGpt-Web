import express from 'express'
import { filterObjectNull, generateNowflakeId, httpBody, pagingData } from '../../utils'
import { aikeyModel } from '../../models'
import keyUsage from '../../helpers/keyUsage'
import { checkAiKeyQueue } from '../../helpers/queue'
const router = express.Router()

router.get('/aikey', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const tokens = await aikeyModel.getAikeys({ page, page_size })
    res.json(httpBody(0, tokens))
})

router.delete('/aikey/:id', async function (req, res, next) {
    const { id } = req.params
    if (!id) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const delRes = await aikeyModel.delAikey(id)
    res.json(httpBody(0, delRes))
})

router.post('/aikey', async function (req, res, next) {
    const { key, host, remarks, models, type, check = 1, status } = req.body
    if (!key || !host || !models) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const id = generateNowflakeId(1)()
    const addRes = await aikeyModel.addAikey({
        id,
        key, host, remarks, status, models, type,
		check
    })
    res.json(httpBody(0, addRes))
})

router.put('/aikey', async function (req, res, next) {
    const { id, key, host, remarks, models, type, status, check } = req.body
    if (!id || !key || !host || !models) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const editRes = await aikeyModel.editAikey(id, {
        key, host, remarks, status, models, type,
		check
    })
    res.json(httpBody(0, editRes))
})

router.post('/aikey/check', async function (req, res, next) {
    // 这块等待优化
    const { key, host, all, type } = req.body
    if(all){
        const tokens = await aikeyModel.getAikeys({page: 0, page_size: 1000}, {
            status: 1,
			check: 1,
        })
        const list = tokens.rows
        list.forEach((item)=>{
            checkAiKeyQueue.addTask({
                ...item.toJSON()
            })
        })
        res.json(httpBody(0, '提交成功'))
        return
    }
    if (!key || !host) {
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const rese = await keyUsage({host, key, type})
    res.json(httpBody(0, rese))
})

export default router

