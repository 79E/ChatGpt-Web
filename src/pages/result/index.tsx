import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function ResultPage() {
  const navigate = useNavigate()
  return (
    <Result
      status="success"
      title="支付成功!"
      subTitle=""
      extra={[
        <Button
          key="home"
          onClick={() => {
            navigate('/')
          }}
        >
          返回首页
        </Button>,
        <Button
          type="primary"
          key="shop"
          onClick={() => {
            navigate('/shop')
          }}
        >
          查看记录
        </Button>
      ]}
    />
  )
}
export default ResultPage
