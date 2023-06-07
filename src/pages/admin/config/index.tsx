import {
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  QueryFilter
} from '@ant-design/pro-components'
import { Button, Form, Space, Tabs, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { getAdminConfig, putAdminConfig } from '@/request/adminApi'
import { ConfigInfo } from '@/types/admin'
import { CloseCircleOutlined, SmileOutlined } from '@ant-design/icons'
import RichEdit from '@/components/RichEdit'

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

  const [drawPriceForm] = Form.useForm<{
    draw_price: number | string
  }>()

  const [webSiteForm] = Form.useForm<{
    website_title: string
    website_description: string
    website_keywords: string
    website_logo: string
    website_footer: string
  }>()

  const shopIntroduce = useRef<string>()
  const userIntroduce = useRef<string>()

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
    const drawPrice = getConfigValue('draw_price', data)
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
    if (drawPrice && drawPrice.value) {
      drawPriceForm.setFieldsValue({
        draw_price: JSON.parse(drawPrice.value)
      })
    }

    const website_title = getConfigValue('website_title', data)
    const website_description = getConfigValue('website_description', data)
    const website_keywords = getConfigValue('website_keywords', data)
    const website_logo = getConfigValue('website_logo', data)
    const website_footer = getConfigValue('website_footer', data)
    webSiteForm.setFieldsValue({
      website_title: website_title.value,
      website_description: website_description.value,
      website_keywords: website_keywords.value,
      website_logo: website_logo.value,
      website_footer: website_footer.value
    })

    const shop_introduce = getConfigValue('shop_introduce', data)
    if (shop_introduce && shop_introduce.value) {
      shopIntroduce.current = shop_introduce.value
    }

    const user_introduce = getConfigValue('user_introduce', data)
    if (user_introduce && user_introduce.value) {
      userIntroduce.current = user_introduce.value
    }
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

  function IntroduceSettings() {
    return (
      <Space
        direction="vertical"
        style={{
          width: '100%'
        }}
      >
        <div className={styles.config_form}>
          <h3>商城页面公告设置</h3>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <RichEdit
              defaultValue={shopIntroduce.current}
              value={shopIntroduce.current}
              onChange={(value) => {
                shopIntroduce.current = value
              }}
            />
          </div>
          <Button
            size="large"
            type="primary"
            onClick={() => {
              onSave({
                shop_introduce: shopIntroduce.current
              })
            }}
          >
            保 存
          </Button>
        </div>
        <div className={styles.config_form}>
          <h3>个人中心页面公告设置</h3>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <RichEdit
              defaultValue={userIntroduce.current}
              value={userIntroduce.current}
              onChange={(value) => {
                userIntroduce.current = value
              }}
            />
          </div>
          <Button
            size="large"
            type="primary"
            onClick={() => {
              onSave({
                user_introduce: userIntroduce.current
              })
            }}
          >
            保 存
          </Button>
        </div>
      </Space>
    )
  }

  function WebSiteSettings() {
    return (
      <Space
        direction="vertical"
        style={{
          width: '100%'
        }}
      >
        <div className={styles.config_form}>
          <h3>网站设置</h3>
          <ProForm
            autoFocus={false}
            autoFocusFirstInput={false}
            form={webSiteForm}
            size="large"
            initialValues={{}}
            isKeyPressSubmit={false}
            submitter={{
              searchConfig: {
                submitText: '保存',
                resetText: '恢复'
              }
            }}
            onFinish={onSave}
            onReset={() => {
              onRewardFormSet(configs)
            }}
          >
            <ProForm.Group>
              <ProFormText
                width="xl"
                name="website_title"
                label="网站标题"
                rules={[{ required: true, message: '请输入网站标题!' }]}
              />
              <ProFormText
                width="xl"
                name="website_logo"
                label="网站LOGO"
                rules={[{ required: true, message: '请输入网站LOGO URL!' }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormTextArea
                width="xl"
                name="website_description"
                fieldProps={{
                  autoSize: {
                    minRows: 2,
                    maxRows: 2
                  }
                }}
                label="网站描述"
                rules={[{ required: true, message: '请输入网站描述!' }]}
              />
              <ProFormTextArea
                width="xl"
                label="网站关键词"
                name="website_keywords"
                fieldProps={{
                  autoSize: {
                    minRows: 2,
                    maxRows: 2
                  }
                }}
                rules={[{ required: true, message: '请输入网站关键词!' }]}
              />
            </ProForm.Group>
            <ProFormTextArea
              name="website_footer"
              label="网站页脚"
              fieldProps={{
                autoSize: {
                  minRows: 2,
                  maxRows: 6
                }
              }}
            />
          </ProForm>
        </div>
      </Space>
    )
  }

  function RewardSettings() {
    return (
      <Space
        direction="vertical"
        style={{
          width: '100%'
        }}
      >
        <div className={styles.config_form}>
          <h3>奖励激励</h3>
          <QueryFilter
			autoFocus={false}
			autoFocusFirstInput={false}
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
		  	autoFocus={false}
			autoFocusFirstInput={false}
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
		  	autoFocus={false}
			autoFocusFirstInput={false}
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
          <p>
            绘画计费规则为每秒消耗多少积分，比如设置10则生成一张512x512图片耗时为2秒则扣除20积分！
          </p>
          <QueryFilter
		  	autoFocus={false}
			autoFocusFirstInput={false}
            form={drawPriceForm}
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
              name="draw_price"
              label="每秒扣除"
              tooltip="每秒扣除积分数"
              min={0}
              max={100000}
            />
          </QueryFilter>
        </div>
      </Space>
    )
  }

  return (
    <div className={styles.config}>
      <Tabs
        defaultActiveKey="WebSiteSettings"
        centered
        type="card"
        items={[
          {
            label: '网站设置',
            key: 'WebSiteSettings',
            children: <WebSiteSettings />
          },
          {
            label: '奖励设置',
            key: 'RewardSettings',
            children: <RewardSettings />
          },
		  {
            label: '页面说明设置',
            key: 'IntroduceSettings',
            children: <IntroduceSettings />
          },
        ]}
      />
    </div>
  )
}
export default ConfigPage
