import { Form } from 'antd'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import { LoginCard } from '@/components/LoginModal'

function LoginPage() {
  const [loginForm] = Form.useForm()
  const navigate = useNavigate()

  return (
    <div className={styles.login}>
      <LoginCard
        form={loginForm}
        onSuccess={() => {
          loginForm.resetFields()
          navigate('/')
        }}
      />
    </div>
  )
}

export default LoginPage
