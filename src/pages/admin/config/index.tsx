import {
	ProForm,
	ProFormDependency,
	ProFormDigit,
	ProFormSelect,
	ProFormText,
	ProFormTextArea,
	QueryFilter
  } from '@ant-design/pro-components'
  import { Button, Form, Space, Tabs, message } from 'antd'
  import { useEffect, useRef, useState } from 'react'
  import styles from './index.module.less'
  import { getAdminConfig, putAdminConfig } from '@/request/adminApi'
  import { ConfigInfo } from '@/types/admin'
  import RichEdit from '@/components/RichEdit'

  function ConfigPage() {
	const [configs, setConfigs] = useState<Array<ConfigInfo>>([])
	const [rewardForm] = Form.useForm<{
	  register_reward: number | string
	  signin_reward: number | string
	  invite_reward: number | string
	  cashback_ratio: number | string
	}>()

	const [aiCarryCountForm] = Form.useForm<{
	  ai3_carry_count: number | string
	  ai4_carry_count: number | string
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

	const [cloudStorageForm] = Form.useForm<{
	  type: string
	  secret_key?: string
	  api_host?: string
	  secret_id?: string
	  bucket?: string
	  access_key_secret?: string
	  access_key_id?: string
	  region?: string
	  local_host?: string
	}>()

	const [prohibitedWordsForm] = Form.useForm<{
	  prohibited_words: string
	}>()

	const [tuputechKeyForm] = Form.useForm<{
	  tuputech_key: string
	}>()

	const [smsForm] = Form.useForm<{
	  user: string
	  password: string
	  sign: string
	  template: string
	}>()

	const [emailForm] = Form.useForm<{
	  host: string
	  port: string | number
	  user: string
	  pass: string
	  from_title: string
	  subject: string
	}>()

	const shopIntroduce = useRef<string>()
	const userIntroduce = useRef<string>()
	const inviteIntroduce = useRef<string>()

	function getConfigValue(key: string, data: Array<ConfigInfo>) {
	  const value = data.filter((c) => c.name === key)[0]
	  return value
	}

	function onRewardFormSet(data: Array<ConfigInfo>) {
	  const registerRewardInfo = getConfigValue('register_reward', data)
	  const signinRewardInfo = getConfigValue('signin_reward', data)
	  const ai3Ratio = getConfigValue('ai3_ratio', data)
	  const ai4Ratio = getConfigValue('ai4_ratio', data)
	  const drawPrice = getConfigValue('draw_price', data)

	  const cashback_ratio = getConfigValue('cashback_ratio', data)
	  const invite_reward = getConfigValue('invite_reward', data)
	  rewardForm.setFieldsValue({
		register_reward: registerRewardInfo.value,
		signin_reward: signinRewardInfo.value,
		invite_reward: invite_reward.value,
		cashback_ratio: cashback_ratio.value
	  })

	  const ai3CarryCountInfo = getConfigValue('ai3_carry_count', data)
	  const ai4CarryCountInfo = getConfigValue('ai4_carry_count', data)
	  aiCarryCountForm.setFieldsValue({
		ai3_carry_count: Number(ai3CarryCountInfo.value) || 0,
		ai4_carry_count: Number(ai4CarryCountInfo.value) || 0
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

	  const invite_introduce = getConfigValue('invite_introduce', data)
	  if (invite_introduce && invite_introduce.value) {
		inviteIntroduce.current = invite_introduce.value
	  }

	  const prohibited_words = getConfigValue('prohibited_words', data)
	  if (prohibited_words && prohibited_words.value) {
		prohibitedWordsForm.setFieldsValue({
		  prohibited_words: prohibited_words.value
		})
	  }

	  const tuputech_key = getConfigValue('tuputech_key', data)
	  if (tuputech_key && tuputech_key.value) {
		tuputechKeyForm.setFieldsValue({
		  tuputech_key: tuputech_key.value
		})
	  }

	  const sms = getConfigValue('sms', data)
	  if (sms && sms.value) {
		const smsData = JSON.parse(sms.value)
		smsForm.setFieldsValue({
		  ...smsData
		})
	  }

	  const email = getConfigValue('email', data)
	  if (email && email.value) {
		const emailData = JSON.parse(email.value)
		emailForm.setFieldsValue({
		  ...emailData
		})
	  }

	  const cloudStorage = getConfigValue('cloud_storage', data)
	  if (cloudStorage && cloudStorage.value) {
		const cloudStorageData = JSON.parse(cloudStorage.value)
		cloudStorageForm.setFieldsValue({
		  ...cloudStorageData
		})
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

	const cloudStorageFormItems: {
	  [key: string]: Array<React.ReactNode>
	} = {
	  local: [
		<ProFormText
		  key="local_host"
		  name="host"
		  label="访问域名(http/https)"
		  // rules={[{ required: true, message: '请输入访问域名（以/结尾）!' }]}
		/>
	  ],
	  tencent: [
		<ProFormText
		  key="tencent_secret_id"
		  name="secret_id"
		  label="SecretId"
		  rules={[{ required: true, message: '请输入SecretId!' }]}
		/>,
		<ProFormText
		  key="tencent_secret_key"
		  name="secret_key"
		  label="SecretKey"
		  rules={[{ required: true, message: '请输入SecretKey!' }]}
		/>,
		<ProFormText
		  key="tencent_bucket"
		  name="bucket"
		  label="Bucket"
		  rules={[{ required: true, message: '请输入Bucket!' }]}
		/>,
		<ProFormText
		  key="tencent_region"
		  name="region"
		  label="Region"
		  rules={[{ required: true, message: '请输入Region!' }]}
		/>
	  ],
	  alioss: [
		<ProFormText
		  key="alioss_access_key_id"
		  name="access_key_id"
		  label="AccessKeyId"
		  rules={[{ required: true, message: '请输入AccessKeyId!' }]}
		/>,
		<ProFormText
		  key="alioss_access_key_secret"
		  name="access_key_secret"
		  label="AccessKeySecret"
		  rules={[{ required: true, message: '请输入AccessKeySecret!' }]}
		/>,
		<ProFormText
		  key="alioss_bucket"
		  name="bucket"
		  label="Bucket"
		  rules={[{ required: true, message: '请输入Bucket!' }]}
		/>,
		<ProFormText
		  key="alioss_region"
		  name="region"
		  label="Region"
		  rules={[{ required: true, message: '请输入Region!' }]}
		/>
	  ],
	  upyun: [
		<ProFormText
		  key="tencent_bucket"
		  name="bucket"
		  label="服务名称"
		  rules={[{ required: true, message: '请输入网站LOGO URL!' }]}
		/>,
		<ProFormText
		  key="upyun_secret_id"
		  name="secret_id"
		  label="操作员"
		  rules={[{ required: true, message: '请输入操作员账号!' }]}
		/>,
		<ProFormText
		  key="upyun_secret_key"
		  name="secret_key"
		  label="操作员密钥"
		  rules={[{ required: true, message: '请输入操作员密钥!' }]}
		/>,
		<ProFormText
		  key="upyun_host"
		  name="host"
		  label="访问域名(http/https)"
		  rules={[{ required: true, message: '请输入访问域名（以/结尾）!' }]}
		/>
	  ],
	  lsky: [
		<ProFormText
		  key="lsky_api_host"
		  name="api_host"
		  label="ApiHost"
		  rules={[{ required: true, message: '请输入网站LOGO URL!' }]}
		/>,
		<ProFormText
		  key="lsky_secret_key"
		  name="secret_key"
		  label="SecretKey"
		  rules={[{ required: true, message: '请输入网站LOGO URL!' }]}
		/>
	  ]
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
		  <div className={styles.config_form}>
			<h3>邀请说明设置</h3>
			<div style={{ marginTop: 20, marginBottom: 20 }}>
			  <RichEdit
				defaultValue={inviteIntroduce.current}
				value={inviteIntroduce.current}
				onChange={(value) => {
				  inviteIntroduce.current = value
				}}
			  />
			</div>
			<Button
			  size="large"
			  type="primary"
			  onClick={() => {
				onSave({
				  invite_introduce: inviteIntroduce.current
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
			  <ProFormDigit
				name="invite_reward"
				label="邀请奖励"
				tooltip="每邀请一位新用户注册奖励积分数"
				min={0}
				max={100000}
			  />
			  <ProFormDigit
				name="cashback_ratio"
				label="消费提成"
				tooltip="下级消费给提成百分比"
				min={0}
				max={100000}
			  />
			</QueryFilter>
		  </div>
		  <div className={styles.config_form}>
			<h3>历史记录携带数量</h3>
			<QueryFilter
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={aiCarryCountForm}
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
				name="ai3_carry_count"
				label="GPT3"
				tooltip="会话上下文携带对话数量"
				min={1}
				max={100000}
			  />
			  <ProFormDigit
				name="ai4_carry_count"
				label="GPT4"
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

	function ReviewProhibitedWordsSettings() {
	  return (
		<Space
		  direction="vertical"
		  style={{
			width: '100%'
		  }}
		>
		  <div className={styles.config_form}>
			<h3>文本审核</h3>
			<p>
			  开通文本审核网址：
			  <a href="https://www.kaifain.com/s/6d23ad5feb78" target="_blank" rel="noreferrer">
				https://www.kaifain.com/s/6d23ad5feb78
			  </a>
			</p>
			<p>如果配置了KEY则会优先使用当前进行审核文本内容</p>
			<QueryFilter
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={tuputechKeyForm}
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
			  labelWidth="auto"
			  span={12}
			  size="large"
			  collapsed={false}
			  defaultCollapsed={false}
			  requiredMark={false}
			  defaultColsNumber={79}
			  searchText="保存"
			  resetText="恢复"
			>
			  <ProFormText width="xl" name="tuputech_key" />
			</QueryFilter>
		  </div>
		  <div className={styles.config_form}>
			<h3>本地违禁词</h3>
			<p style={{ marginBottom: 12 }}>请以英文状态下的逗号(,)分隔违禁词</p>
			<ProForm
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={prohibitedWordsForm}
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
			  <ProFormTextArea
				name="prohibited_words"
				fieldProps={{
				  autoSize: {
					minRows: 2,
					maxRows: 12
				  }
				}}
			  />
			</ProForm>
		  </div>
		</Space>
	  )
	}

	function SmsSettings() {
	  return (
		<Space
		  direction="vertical"
		  style={{
			width: '100%'
		  }}
		>
		  <div className={styles.config_form}>
			<h3>短信设置</h3>
			<ProForm
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={smsForm}
			  size="large"
			  initialValues={{}}
			  isKeyPressSubmit={false}
			  submitter={{
				searchConfig: {
				  submitText: '保存',
				  resetText: '恢复'
				}
			  }}
			  onFinish={(vales) => {
				return onSave({
				  sms: JSON.stringify(vales)
				})
			  }}
			  onReset={() => {
				onRewardFormSet(configs)
			  }}
			>
			  <ProForm.Group>
				<ProFormText
				  width="xl"
				  name="user"
				  label="用户名"
				  rules={[{ required: true, message: '请输入短信服务商的用户名!' }]}
				/>
				<ProFormText
				  width="xl"
				  name="password"
				  label="API Key"
				  rules={[{ required: true, message: '请输入API Key!' }]}
				/>
				<ProFormText
				  width="xl"
				  name="sign"
				  label="短信签名"
				  rules={[{ required: true, message: '请输入短信签名!' }]}
				/>
				<ProFormTextArea
				  width="xl"
				  name="template"
				  fieldProps={{
					autoSize: {
					  minRows: 2,
					  maxRows: 2
					}
				  }}
				  label="短信模版"
				  rules={[{ required: true, message: '请输入短信模版!' }]}
				/>
				<Space direction="vertical" size="small">
				  <p>
					1. 案例模版：
					{
					  '您的验证码为：{code}，有效期{time}分钟，请勿泄露。如非本人操作，请忽略此短信。谢谢！'
					}
				  </p>
				  <p>2. 会自动替换 code，time，如您自己定制模版请遵守这个规则。</p>
				  <p>
					3.
					最终：【Ai之家】您的验证码为：123456，有效期10分钟，请勿泄露。如非本人操作，请忽略此短信。谢谢！
				  </p>
				  <p
					style={{
					  marginBottom: 20
					}}
				  >
					4. 短信服务商为:{' '}
					<a href="https://www.smsbao.com" target="_blank" rel="noreferrer">
					  【短信宝】
					</a>
				  </p>
				</Space>
			  </ProForm.Group>
			</ProForm>
		  </div>
		</Space>
	  )
	}

	function EmailSettings() {
	  return (
		<Space
		  direction="vertical"
		  style={{
			width: '100%'
		  }}
		>
		  <div className={styles.config_form}>
			<h3>邮件设置</h3>
			<ProForm
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={emailForm}
			  size="large"
			  initialValues={{}}
			  isKeyPressSubmit={false}
			  submitter={{
				searchConfig: {
				  submitText: '保存',
				  resetText: '恢复'
				}
			  }}
			  onFinish={(vales) => {
				return onSave({
				  email: JSON.stringify(vales)
				})
			  }}
			  onReset={() => {
				onRewardFormSet(configs)
			  }}
			>
			  <ProForm.Group>
				<ProFormText
				  width="xl"
				  name="host"
				  label="SMTP服务器"
				  rules={[{ required: true, message: '请输入SMTP服务器!' }]}
				/>
				<ProFormText
				  width="xl"
				  name="port"
				  label="SMTP端口"
				  rules={[{ required: true, message: '请输入SMTP端口!' }]}
				/>
				<ProFormText
				  width="xl"
				  name="user"
				  label="邮箱账号"
				  rules={[{ required: true, message: '请输入短信签名!' }]}
				/>
				<ProFormText
				  width="xl"
				  name="pass"
				  label="邮箱密码"
				  rules={[{ required: true, message: '请输入短信签名!' }]}
				/>
				<ProFormText width="xl" name="from_title" label="发件用户名称" />
				<ProFormText width="xl" name="subject" label="邮件标题" />
			  </ProForm.Group>
			</ProForm>
		  </div>
		</Space>
	  )
	}

	function CloudStorageSettings() {
	  return (
		<Space
		  direction="vertical"
		  style={{
			width: '100%'
		  }}
		>
		  <div className={styles.config_form}>
			<h3>图片存储配置</h3>
			<ProForm
			  autoFocus={false}
			  autoFocusFirstInput={false}
			  form={cloudStorageForm}
			  size="large"
			  initialValues={{
				type: 'local'
			  }}
			  isKeyPressSubmit={false}
			  submitter={{
				searchConfig: {
				  submitText: '保存',
				  resetText: '恢复'
				}
			  }}
			  onFinish={(vales) => {
				return onSave({
				  cloud_storage: JSON.stringify(vales)
				})
			  }}
			  onReset={() => {
				onRewardFormSet(configs)
			  }}
			>
			  <ProFormSelect
				name="type"
				label="存储策略"
				valueEnum={{
				  local: '本地存储',
				  tencent: '腾讯云存储',
				  alioss: '阿里云存储',
				  upyun: '又拍云存储',
				  lsky: 'Lsky图床'
				}}
				placeholder="请选择存储策略！"
				rules={[{ required: true, message: '请选择存储策略！' }]}
			  />

			  <ProFormDependency name={['type']}>
				{({ type }) => {
				  return cloudStorageFormItems[type]
				}}
			  </ProFormDependency>
			</ProForm>
		  </div>
		</Space>
	  )
	}

	return (
	  <div className={styles.config}>
		<Tabs
		  defaultActiveKey="WebSiteSettings"
		  // centered
		  // type="card"
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
			{
			  label: '违禁词审核设置',
			  key: 'ReviewProhibitedWordsSettings',
			  children: <ReviewProhibitedWordsSettings />
			},
			{
			  label: '短信配置',
			  key: 'SmsSettings',
			  children: <SmsSettings />
			},
			{
			  label: '邮件配置',
			  key: 'EmailSettings',
			  children: <EmailSettings />
			},
			{
			  label: '存储配置',
			  key: 'CloudStorageSettings',
			  children: <CloudStorageSettings />
			}
		  ]}
		/>
	  </div>
	)
  }
  export default ConfigPage
