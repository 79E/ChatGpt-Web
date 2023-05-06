import { getCode } from '@/request/api'
import { fetchLogin } from '@/store/async'
import { RequestLoginParams } from '@/types'
import {
  HeartFilled,
  LockOutlined,
  MobileOutlined,
  RedditCircleFilled,
  SlackCircleFilled,
  TwitterCircleFilled
} from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form'
import { Form, Modal, Space } from 'antd'

type Props = {
  open: boolean
  onCancel: () => void
}

// 登录注册弹窗
function LoginModal(props: Props) {
  const [loginForm] = Form.useForm()

  const onCancel = () => {
    props.onCancel()
    loginForm.resetFields()
  }

  return (
    <Modal open={props.open} footer={null} destroyOnClose onCancel={onCancel}>
      <LoginForm<RequestLoginParams>
        form={loginForm}
        logo={import.meta.env.VITE_APP_LOGO}
        title=""
        subTitle="全网最便宜的人工智能对话"
        actions={
          <Space>
            <HeartFilled />
            <RedditCircleFilled />
            <SlackCircleFilled />
            <TwitterCircleFilled />
          </Space>
        }
        contentStyle={{
          width: 'auto',
          minWidth: '100px'
        }}
        onFinish={async (e) => {
          return new Promise((resolve, reject) => {
            fetchLogin({ ...e })
              .then((res) => {
                if (res.code) {
                  reject(false)
                  return
                }
                onCancel()
                resolve(true)
              })
              .catch(() => {
                reject(false)
              })
          })
        }}
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined />
          }}
          name="account"
          placeholder="邮箱或手机号"
          rules={[
            {
              required: true,
              message: '邮箱或手机号'
            }
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />
          }}
          captchaProps={{
            size: 'large'
          }}
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'获取验证码'}`
            }
            return '获取验证码'
          }}
          name="code"
          rules={[
            {
              required: true,
              message: '请输入验证码！'
            }
          ]}
          onGetCaptcha={async () => {
            const account = loginForm.getFieldValue('account')
            return new Promise((resolve, reject) =>
              getCode({ account })
                .then(() => resolve())
                .catch(reject)
            )
          }}
        />
        <div
          style={{
            marginBlockEnd: 24
          }}
        />
      </LoginForm>
    </Modal>
  )
}

export default LoginModal
