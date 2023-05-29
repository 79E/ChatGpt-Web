import {
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormText,
  QueryFilter
} from '@ant-design/pro-components'
import { Button, Form, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.less'
import { getAdminConfig, putAdminConfig } from '@/request/adminApi'
import { ConfigInfo } from '@/types/admin'
import { CloseCircleOutlined, SmileOutlined } from '@ant-design/icons'

function ConfigPage() {
  const [configs, setConfigs] = useState<Array<ConfigInfo>>([])
  const [rewardForm] = Form.useForm<{
    register_reward: number | string
    signin_reward: number | string
  }>()

  const [historyMessageForm] = Form.useForm<{
    history_message_count: number | string
  }>()

  const [aiRatioForm] = Form.useForm<{
    ai3_ratio: number | string
    ai4_ratio: number | string
  }>()

  const [drawUsePriceForm] = Form.useForm<{
    draw_use_price: Array<{
      size: string
      integral: number
    }>
  }>()

  function getConfigValue(key: string, data: Array<ConfigInfo>) {
    const value = data.filter((c) => c.name === key)[0]
    return value
  }

  function onRewardFormSet(data: Array<ConfigInfo>) {
    const registerRewardInfo = getConfigValue('register_reward', data)
    const signinRewardInfo = getConfigValue('signin_reward', data)
    const historyMessageCountInfo = getConfigValue('history_message_count', data)
    const ai3Ratio = getConfigValue('ai3_ratio', data)
    const ai4Ratio = getConfigValue('ai4_ratio', data)
    const drawUsePrice = getConfigValue('draw_use_price', data)
    rewardForm.setFieldsValue({
      register_reward: registerRewardInfo.value,
      signin_reward: signinRewardInfo.value
    })
    historyMessageForm.setFieldsValue({
      history_message_count: Number(historyMessageCountInfo.value)
    })
    aiRatioForm.setFieldsValue({
      ai3_ratio: Number(ai3Ratio.value),
      ai4_ratio: Number(ai4Ratio.value)
    })
    if (drawUsePrice && drawUsePrice.value) {
      drawUsePriceForm.setFieldsValue({
        draw_use_price: JSON.parse(drawUsePrice.value)
      })
    }
    // else {
    //   const drawUsePriceInitData = {
    //     draw_use_price: [
    //       {
    //         size: '256x256',
    //         integral: 80
    //       },
    //       {
    //         size: '512x512',
    //         integral: 90
    //       },
    //       {
    //         size: '1024x1024',
    //         integral: 100
    //       }
    //     ]
    //   }
    //   drawUsePriceForm.setFieldsValue(drawUsePriceInitData)
    //   onSave({
    //     draw_use_price: JSON.stringify(drawUsePriceInitData.draw_use_price)
    //   })
    // }
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

  async function onSave(values: any) {
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
      <Space
        direction="vertical"
        style={{
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
              tooltip="会话上下文携带对话数量"
              min={1}
              max={100000}
            />
          </QueryFilter>
        </div>
        <div className={styles.config_form}>
          <h3>对话积分扣除比例</h3>
          <p>
            设置1积分等于多少Token，比如：1积分=50Token，那么单次会话消耗100Token就需要扣除2积分。
          </p>
          <QueryFilter
            form={aiRatioForm}
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
              name="ai3_ratio"
              label="GPT3"
              tooltip="每1积分等于多少Token"
              min={0}
              max={100000}
            />
            <ProFormDigit
              name="ai4_ratio"
              label="GPT4"
              tooltip="每1积分等于多少Token"
              min={0}
              max={100000}
            />
          </QueryFilter>
        </div>
        <div className={styles.config_form}>
          <h3>绘画积分扣除设置</h3>
          <p>分为三个规格 256x256 512x512 1024x1024 请分别设置, 如为设置则不扣除积分。</p>
          <ProForm
            form={drawUsePriceForm}
            onFinish={(values) => {
              values.draw_use_price = JSON.stringify(values.draw_use_price) as any
              return onSave(values)
            }}
            onReset={() => {
              onRewardFormSet(configs)
            }}
            size="large"
            requiredMark={false}
            isKeyPressSubmit={false}
            submitter={{
              searchConfig: {
                submitText: '保存',
                resetText: '恢复'
              }
            }}
          >
            <ProFormList
              creatorButtonProps={{
                creatorButtonText: '添加绘画规格扣除项'
              }}
              name="draw_use_price"
              min={1}
              max={3}
            >
              <ProFormGroup key="group">
                <ProFormText
                  name="size"
                  label="规格大小"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                />
                <ProFormDigit
                  name="integral"
                  label="消耗积分"
                  min={0}
                  max={100000}
                  rules={[
                    {
                      required: true
                    }
                  ]}
                />
              </ProFormGroup>
            </ProFormList>
          </ProForm>
        </div>
      </Space>
    </div>
  )
}
export default ConfigPage
