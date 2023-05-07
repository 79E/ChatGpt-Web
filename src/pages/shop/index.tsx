import UserInfoCard from '@/components/UserInfoCard'
import styles from './index.module.less'
import Layout from '@/components/Layout'
import useStore from '@/store'
import { Input, Space, Table } from 'antd';
import GoodsList from '@/components/GoodsList';
import { SyncOutlined } from '@ant-design/icons';

function GoodsPay() {

  const { user_detail } = useStore();

  return (
    <div className={styles.goodsPay}>
      <Layout>
        <div className={styles.goodsPay_container}>
          <Space direction="vertical" style={{width:'100%'}}>
            {/* 用户信息 */}
            <UserInfoCard info={user_detail} />
            {/* 卡密充值区 */}
            <div className={styles.goodsPay_card}>
              <h4>卡密充值</h4>
              <Input.Search
                placeholder="请输入充值卡密"
                allowClear
                enterButton="充值"
                size="large"
                bordered
                onSearch={() => {
                  console.log('充值')
                }}
              />
            </div>
            <div className={styles.goodsPay_card}>
              <h4>在线充值</h4>
              <GoodsList />
            </div>
            <div className={styles.goodsPay_card}>
              <h4>订单记录 <SyncOutlined spin={false} /></h4>
              <Table bordered columns={[
                {
                  title: '描述',
                  dataIndex: 'age',
                  key: 'age',
                },
                {
                  title: '额度',
                  dataIndex: 'age',
                  key: 'age',
                },
                {
                  title: '日期',
                  dataIndex: 'age',
                  key: 'age',
                },
              ]} 
              />
            </div>
          </Space>
        </div>
      </Layout>
    </div>
  )
}

export default GoodsPay
