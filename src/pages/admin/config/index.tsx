import {
    ProFormDigit,
    QueryFilter,
} from '@ant-design/pro-components';
import { Form, Space, message } from 'antd';
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

    const [historyMessageForm] = Form.useForm<{
        history_message_count: number | string,
    }>();

    function getConfigValue(key: string, data: Array<ConfigInfo>) {
        const value = data.filter(c => c.name === key)[0]
        return value
    }

    function onRewardFormSet(data: Array<ConfigInfo>) {
        const registerRewardInfo = getConfigValue('register_reward', data)
        const signinRewardInfo = getConfigValue('signin_reward', data)
        const historyMessageCountInfo = getConfigValue('history_message_count', data)
        rewardForm.setFieldsValue({
            register_reward: registerRewardInfo.value,
            signin_reward: signinRewardInfo.value
        })
        historyMessageForm.setFieldsValue({
            history_message_count: Number(historyMessageCountInfo.value)
        })
    }


    function onGetConfig() {
        getAdminConfig().then((res) => {
            if (res.code) {
                message.error('获取配置错误')
                return
            }
            onRewardFormSet(res.data)
            setConfigs(res.data)
        })
    }

    useEffect(() => {
        onGetConfig()
    }, [])

    async function onSave(values: any){
        return putAdminConfig(values).then((res) => {
            if (res.code) {
                message.error('保存失败')
                return
            }
            message.success('保存成功')
            onGetConfig()
        })
    }

    return (
        <div className={styles.config}>
            <Space direction="vertical" style={{
                width: '100%'
            }}
            >
                <div className={styles.config_form}>
                    <h3>奖励激励</h3>
                    <QueryFilter
                        form={rewardForm}
                        onFinish={async (values: any) => {
                            putAdminConfig(values).then((res) => {
                                if (res.code) {
                                    message.error('保存失败')
                                    return
                                }
                                message.success('保存成功')
                                onGetConfig()
                            })
                        }}
                        onReset={() => {
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
                <div className={styles.config_form}>
                    <h3>历史记录</h3>
                    <QueryFilter
                        form={historyMessageForm}
                        onFinish={onSave}
                        onReset={() => {
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
                            name="history_message_count"
                            label="携带数量"
                            tooltip="新用户注册赠送积分数量"
                            min={1}
                            max={100000}
                        />
                    </QueryFilter>
                </div>
            </Space>
        </div>
    )
}
export default ConfigPage;