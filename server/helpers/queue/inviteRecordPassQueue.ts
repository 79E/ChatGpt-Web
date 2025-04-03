import { userModel, turnoverModel, inviteRecordModel } from '../../models';
import { filterObjectNull, generateNowflakeId } from '../../utils';
import createQueue from './function';

const InviteRecordPassQueue = createQueue('InviteRecordPassQueue');

// 向队列新增
async function addTask(data, options?){
    const res = await InviteRecordPassQueue.add(data, options);
    return res;
}

// 消费
InviteRecordPassQueue.process(async (job) => {
    const { id, superior_id, reward, reward_type } = job.data;
    // 修改状态
    await inviteRecordModel.editInviteRecord(id, filterObjectNull({
        status: 1, remark: '发放成功'
    }))
    const turnoverId = generateNowflakeId(1)()
    // 给那个人加上积分
    await turnoverModel.addTurnover({
        id: turnoverId,
        user_id: superior_id,
        describe: '邀请新用户奖励',
        value: `${reward}${reward_type === 'day' ? '天' : '积分'}`
    })
    await userModel.updataUserVIP({
        id: superior_id,
        value: Number(reward),
        type: reward_type,
        operate: 'increment'
    })
    return
});

export default {
    addTask
};