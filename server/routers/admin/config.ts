import express from 'express'
import { filterObjectNull, httpBody } from '../../utils'
import { configModel } from '../../models'
const router = express.Router()

router.get('/config', async function (req, res, next) {
    const configs = await configModel.getConfig()
    res.json(httpBody(0, configs))
})

router.put('/config', async function (req, res, next) {
    const { body } = req;
    const configs = await configModel.getConfig()

    if(!body || !configs || configs.length <= 0){
        res.json(httpBody(-1, '缺少必要参数'))
        return
    }
    const insert: Array<any> = []
    for (const config of configs) {
        const json = config.toJSON()
        if(body[json.name] || body[json.name] === 0 || body[json.name] === ''){
            insert.push({
				...filterObjectNull({
					...json,
					create_time: null,
					update_time: null
				}),
				value: body[json.name].toString(),
			})
        }
    }

    if(insert.length <= 0){
        res.json(httpBody(-1, '无内容需要修改'))
        return
    }
    const editRes = await configModel.editConfigs(insert)
    res.json(httpBody(editRes.code, '修改成功'))
})

export default router

