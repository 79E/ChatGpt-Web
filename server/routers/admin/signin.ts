import express from 'express'
import { httpBody, pagingData } from '../../utils'
import { signinModel } from '../../models'
const router = express.Router()

router.get('/signin', async function (req, res, next) {
    const { page, page_size } = pagingData({
        page: req.query.page,
        page_size: req.query.page_size
    })
    const signins = await signinModel.getSignins({ page, page_size })
    res.json(httpBody(0, signins))
})

export default router

