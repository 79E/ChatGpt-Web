import { useEffect, useState } from 'react'
import UserInfoCard from '@/components/UserInfoCard'
import styles from './index.module.less'
import Layout from '@/components/Layout'
import useStore from '@/store'
import { Button, Input, Modal, Space, Table, message } from 'antd'
import GoodsList from '@/components/GoodsList'
import { CloseCircleFilled, SyncOutlined } from '@ant-design/icons'
import { fetchProduct, fetchUserInfo } from '@/store/async'
import { getIntegralLogs, postPrepay } from '@/request/api'
import { ProductInfo } from '@/types'
import OpenAiLogo from '@/components/OpenAiLogo'
import { generateUUID } from '@/utils'

function GoodsPay() {
  const { goodsList, user_detail } = useStore()

  const [log, setLog] = useState({
    page: 1,
    pageSize: 10,
    loading: false,
    data: []
  })

  const [payModal, setPayModal] = useState<{
    open: boolean
    status: 'loading' | 'fail' | 'pay'
    order_sn?: string
    payurl?: string
    qrcode?: string
  }>({
    open: false,
    status: 'loading',
    order_sn: '',
    payurl: '',
    qrcode: ''
  })

  useEffect(() => {
    fetchProduct()
    onGetLog(1)
  }, [])

  function onGetLog(page: number) {
    setLog((l) => ({ ...l, page, loading: true }))
    getIntegralLogs({
      page: page,
      pageSize: log.pageSize
    })
      .then((res: any) => {
        setLog((l) => ({ ...l, page, data: res.data, loading: false }))
      })
      .finally(() => {
        setLog((l) => ({ ...l, page, loading: false }))
      })
  }

  async function onPay(item: ProductInfo) {
    setPayModal((p) => ({ ...p, open: true }))
    const payres = await postPrepay({
      pay_type: 'alipay',
      product_id: item.id,
      num: 1
    })

    if (payres.code) {
      setPayModal((p) => ({ ...p, status: 'fail' }))
      return
    }
    const { order_sn, payurl, qrcode } = payres.data
    setPayModal((p) => ({ ...p, status: 'pay', ...payres.data }))
    if (order_sn && payurl && !qrcode) {
      setTimeout(() => {
        window.open(payurl, '_blank')
      }, 500)
    }
  }

  function onPayResult() {
    // 刷新记录
    onGetLog(1)
    // 刷新用户信息
    fetchUserInfo()
    setPayModal((p) => ({ ...p, status: 'loading', open: false }))
  }

  return (
    <div className={styles.goodsPay}>
      <Layout>
        <div className={styles.goodsPay_container}>
          <Space direction="vertical" style={{ width: '100%' }}>
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
              <GoodsList list={goodsList} onClick={onPay} />
            </div>
            <div className={styles.goodsPay_card}>
              <h4
                onClick={() => {
                  onGetLog(1)
                }}
              >
                订单记录 <SyncOutlined spin={log.loading} />
              </h4>
              <Table
                bordered
                key={generateUUID()}
                loading={log.loading}
                dataSource={log.data}
                pagination={{
                  hideOnSinglePage: true,
                  defaultPageSize: 1000
                }}
                columns={[
                  {
                    title: '描述',
                    key: 'title'
                  },
                  {
                    title: '额度',
                    key: 'integral',
                    render: (data) => {
                      return (
                        <a>
                          {Number(data.type) === 2 ? '-' : '+'}
                          {data.integral}分
                        </a>
                      )
                    }
                  },
                  {
                    title: '日期',
                    key: 'created_at'
                  }
                ]}
              />
            </div>
          </Space>

          <Modal
            open={payModal.open}
            onCancel={() => {
              // 关闭
              setPayModal({
                open: false,
                status: 'loading'
              })
            }}
            footer={null}
            width={320}
          >
            <div className={styles.payModal}>
              {payModal.status === 'fail' ? (
                <CloseCircleFilled className={styles.payModal_icon} />
              ) : (
                <OpenAiLogo rotate width="3em" height="3em" />
              )}
              {payModal.status === 'fail' ? <p>支付失败，请重新尝试</p> : <p>正在等待支付中...</p>}
              <Space>
                <Button
                  danger
                  onClick={() => {
                    onPayResult()
                  }}
                >
                  取消支付
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    onPayResult()
                  }}
                >
                  支付完成了
                </Button>
              </Space>
            </div>
          </Modal>
        </div>
      </Layout>
    </div>
  )
}

export default GoodsPay
