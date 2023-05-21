import {
    ProFormDigit,
    QueryFilter,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.module.less'
import { getAdminConfig, putAdminConfig } from '@/request/adminApi';
import { ConfigInfo } from '@/types/admin'

function ConfigPage() {

    const [configs, setConfigs] = useState<Array<ConfigInfo>>([])
    const [rewardForm] = Form.useForm<{
        register_reward: number | string,
        signin_reward: number | string,
    }>();

    function getConfigValue (key: string, data: Array<ConfigInfo>){
        const value = data.filter(c => c.name === key)[0]
        return value
    }

    function onRewardFormSet (data: Array<ConfigInfo>){
        const registerRewardInfo = getConfigValue('register_reward', data)
        const signinRewardInfo = getConfigValue('signin_reward', data)
        rewardForm.setFieldsValue({
            register_reward: registerRewardInfo.value,
            signin_reward: signinRewardInfo.value
        })
    }


    function onGetConfig (){
        getAdminConfig().then((res)=>{
            if(res.code){
                message.error('获取配置错误')
                return
            }
            onRewardFormSet(res.data)
            setConfigs(res.data)
        })
    }

    useEffect(()=>{
        onGetConfig()
    },[])

    return (
        <div className={styles.config}>
            <div className={styles.config_form}>
                <h3>奖励激励</h3>
                <QueryFilter
                    form={rewardForm}
                    onFinish={async (values: any) => {
                        putAdminConfig(values).then((res)=>{
                            if(res.code) {
                                message.error('保存失败')
                                return
                            }
                            message.success('保存成功')
                            onGetConfig()
                        })
                    }}
                    onReset={()=>{
                        onRewardFormSet(configs)
                    }}
                    size="large"
                    collapsed={false}
                    defaultCollapsed={false}
                    requiredMark={false}
                    defaultColsNumber={79}
                    searchText="保存"
                    resetText="恢复"
                >
                    <ProFormDigit
                        name="register_reward"
                        label="注册奖励"
                        tooltip="新用户注册赠送积分数量"
                        min={0}
                        max={100000}
                    />
                    <ProFormDigit
                        name="signin_reward"
                        label="签到奖励"
                        tooltip="每日签到赠送积分数量"
                        min={0}
                        max={100000}
                    />
                </QueryFilter>
            </div>
        </div>
    )
}
export default ConfigPage;