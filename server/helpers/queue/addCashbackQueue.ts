import { userModel, productModel, cashbackModel, configModel } from '../../models';
import { generateNowflakeId } from '../../utils';
import createQueue from './function';

const AddCashbackQueue = createQueue('AddCashbackQueue');

// 向队列新增
async function addTask(data, options?) {
  const res = await AddCashbackQueue.add(data, options);
  return res;
}

// 消费
AddCashbackQueue.process(async (job) => {
  const { user_id, order_id, product_id } = job.data;
  if (!user_id || !product_id) return
  const userInfo = await userModel.getUserInfo({ id: user_id })
  // 判断是否有上级 并 如果有
  if (!userInfo.id || !userInfo.superior_id || !userInfo.invite_code) return
  const superiorUserInfo = await userModel.getUserInfo({ id: userInfo.superior_id })
  const productInfo = await productModel.getProduct(product_id)
  const cashback_ratio = superiorUserInfo.cashback_ratio || (await configModel.getConfigValue('cashback_ratio')) || 0
  const cashbackId = generateNowflakeId(1)()
  await cashbackModel.addCashback({
    id: cashbackId,
    user_id: user_id,
    benefit_id: userInfo.superior_id,
    pay_amount: productInfo.price,
    commission_rate: cashback_ratio,
    commission_amount: Math.floor(productInfo.price * Number(cashback_ratio) / 100),
    remark: '等待审核',
    statue: 3,
    order_id,
  });
  return
});

export default {
    addTask
};
