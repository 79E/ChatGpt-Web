// 检查OpenAi key 是否正常
// import { payModels } from '../../models';
// import { wxPayClose } from '../request/wx_api';
import { aikeyModel } from '../../models';
import keyUsage from '../keyUsage';
import createQueue from './function';

const CheckAiKeyQueue = createQueue('CheckAiKeyQueue');

// 向队列新增
async function addTask(data, options?){
    const res = await CheckAiKeyQueue.add(data, options);
    return res;
}

// 消费
CheckAiKeyQueue.process(async (job) => {
    const { id } = job.data;
    const check = await keyUsage(job.data);
    let status = 1;
    const limit = Number(check.hard_limit_usd)
    const usage = Number(check.total_usage)
    if(check.status){
        status = 0
    }
    if(limit <= usage){
        status = 0
    }
    await aikeyModel.editAikey(id, {
        limit,
        usage,
        status
    })
    return
});

export default {
    addTask
};