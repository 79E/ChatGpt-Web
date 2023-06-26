import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Form,
  Pagination,
  QRCode,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from 'antd'
import Layout from '@/components/Layout'
import { getCode, getSigninList, postSignin } from '@/request/api'
import { userAsync } from '@/store/async'
import { configStore, userStore } from '@/store'
import styles from './index.module.less'
import { ConsumeRecordInfo, InvitationRecordInfo, SigninInfo, WithdrawalRecordInfo } from '@/types'
import { formatTime, transform } from '@/utils'
import UserInfoCard from '@/components/UserInfoCard'
import {
  ModalForm,
  ProFormCaptcha,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { fetchUserPassword, fetchUserRecords, fetchUserWithdrawal } from '@/store/user/async'
import { useNavigate } from 'react-router-dom'
import { ColumnsType } from 'antd/es/table'

const monthAbbreviations = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
]

function UserPage() {
  const navigate = useNavigate()
  const { token, user_info, invitation_records, consume_records, withdrawal_records } = userStore()
  const { user_introduce, invite_introduce } = configStore()
  const [userAccountForm] = Form.useForm()
  const [signinLoading, setSigninLoading] = useState(false)
  const [signinList, setSigninList] = useState<Array<SigninInfo>>([])
  const [withdrawalForm] = Form.useForm()

  const [userAccountModal, setUserAccountModal] = useState({
    open: false,
    title: '修改信息',
    type: ''
  })

  const [withdrawalInfoModal, setWithdrawalInfoModal] = useState({
    open: false
  })

  const [tableOptions, setTableOptions] = useState<{
    page: number
    page_size: number
    type: number | string
    loading: boolean
  }>({
    page: 1,
    page_size: 10,
    loading: false,
    type: 'invitation_records'
  })

  const invitationRecordColumns: ColumnsType<InvitationRecordInfo> = [
    {
      title: '注册者',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (_, data) => {
        return <Tag>{data.user.account}</Tag>
      }
    },
    // {
    //   title: '邀请码',
    //   dataIndex: 'invite_code',
    //   key: 'invite_code'
    // },
    {
      title: '奖励',
      dataIndex: 'reward',
      key: 'reward',
      render: (_, data) => {
        return <a>{data.reward}积分</a>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, data) => {
        if (data.status === 3) {
          return <Tag color="orange">正在审核</Tag>
        }
        if (data.status) {
          return <Tag color="green">发放成功</Tag>
        }
        return <Tag color="red">异常邀请</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    }
  ]

  const consumeRecordColumns: ColumnsType<ConsumeRecordInfo> = [
    {
      title: '消费用户',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (_, data) => {
        return <Tag>{data.user.account}</Tag>
      }
    },
    {
      title: '支付金额',
      dataIndex: 'pay_amount',
      key: 'pay_amount',
      render: (_, data) => {
        return <a>{Number(data.pay_amount) / 100}元</a>
      }
    },
    {
      title: '提成比例',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
      render: (_, data) => {
        return <a>{data.commission_rate}%</a>
      }
    },
    {
      title: '提成金额',
      dataIndex: 'commission_amount',
      key: 'commission_amount',
      render: (_, data) => {
        return <a>{Number(data.commission_amount) / 100}元</a>
      }
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, data) => {
        if (data.status === 3) {
          return <Tag color="orange">正在审核</Tag>
        }
        if (data.status) {
          return <Tag color="green">发放成功</Tag>
        }
        return <Tag color="red">异常消费</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    }
  ]
  const withdrawalRecordColumns: ColumnsType<WithdrawalRecordInfo> = [
    // {
    //   title: '姓名',
    //   dataIndex: 'name',
    //   key: 'name'
    // },
    // {
    //   title: '联系方式',
    //   dataIndex: 'contact',
    //   key: 'contact'
    // },
    {
      title: '收款方式',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (_, data) => {
        switch (data.type) {
          case 'wxpay':
            return <Tag>微信支付</Tag>
          case 'qqpay':
            return <Tag>QQ支付</Tag>
          case 'alipay':
            return <Tag>支付宝</Tag>
          default:
            return '-'
        }
      }
    },
    {
      title: '收款账号',
      dataIndex: 'account',
      key: 'account',
      width: 140
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_, data) => {
        return <Tag>{transform.centToYuan(data.amount)}元</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, data) => {
        if (data.status === 3) {
          return <Tag color="orange">等待审核</Tag>
        }
        if (data.status === 1) {
          return <Tag color="green">打款成功</Tag>
        }
        return <Tag color="red">异常提现</Tag>
      }
    },
    {
      title: '备注/回复',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      ellipsis: {
        showTitle: false
      },
      render: (_, data) => <Tooltip title={data.remarks}>{data.remarks}</Tooltip>
    },
    {
      title: '留言',
      dataIndex: 'message',
      key: 'message',
      width: 120,
      ellipsis: {
        showTitle: false
      },
      render: (_, data) => <Tooltip title={data.message}>{data.message}</Tooltip>
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time'
    }
  ]

  const getTableColumns: any = useMemo(() => {
    if (tableOptions.type === 'invitation_records') {
      return [...invitationRecordColumns]
    }

    if (tableOptions.type === 'consume_records') {
      return [...consumeRecordColumns]
    }

    if (tableOptions.type === 'withdrawal_records') {
      return [...withdrawalRecordColumns]
    }
    return []
  }, [tableOptions.type])

  const getTableData: { count: number; rows: Array<any> } = useMemo(() => {
    if (tableOptions.type === 'invitation_records') {
      return { ...invitation_records }
    }

    if (tableOptions.type === 'consume_records') {
      return { ...consume_records }
    }

    if (tableOptions.type === 'withdrawal_records') {
      return { ...withdrawal_records }
    }
    return { count: 0, rows: [] }
  }, [tableOptions.type, withdrawal_records, consume_records, invitation_records])

  function onFetchSigninList() {
    if (!token) return
    getSigninList().then((res) => {
      if (res.code) return
      setSigninList(res.data)
    })
  }

  const monthDays = useMemo(() => {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const daysInMonth = new Date(year, month, 0).getDate()
    const dateArray = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      return formatTime('yyyy-MM-dd', new Date(`${year}-${month}-${day}`))
    })
    return dateArray
  }, [])

  const userMonthDays = useMemo(() => {
    const dataList = signinList.map((item) => {
      return formatTime('yyyy-MM-dd', new Date(item.create_time))
    })
    return dataList
  }, [signinList])

  useEffect(() => {
    onUserRecords({ ...tableOptions })
    onFetchSigninList()
  }, [])

  function onUserRecords(params: { page: number; page_size: number; type: string | number }) {
    setTableOptions({
      type: params.type,
      page: params.page,
      page_size: params.page_size,
      loading: true
    })
    fetchUserRecords({
      ...params
    })
      .then((res) => {
        if (res.code) return
        setTableOptions((options) => ({ ...options, loading: false }))
      })
      .finally(() => {
        setTableOptions((options) => ({ ...options, loading: false }))
      })
  }

  return (
    <div className={styles.userPage}>
      <Layout>
        <div className={styles.userPage_container}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* 用户信息 */}
            <UserInfoCard info={user_info}>
              <div className={styles.userPage_operate}>
                {/* <Button block
                                    onClick={() => {
                                        setUserAccountModal({
                                            open: true,
                                            title: '修改账号',
                                            type: 'account'
                                        })
                                        userAccountForm.setFieldsValue({
                                            account: user_info?.account
                                        })
                                    }}
                                >
                                    修改账号
                                </Button> */}
                <Button
                  block
                  type="dashed"
                  danger
                  onClick={() => {
                    setUserAccountModal({
                      open: true,
                      title: '重置密码',
                      type: 'password'
                    })
                    userAccountForm.setFieldsValue({
                      account: user_info?.account
                    })
                  }}
                >
                  重置密码
                </Button>
              </div>
            </UserInfoCard>
            {user_introduce && (
              <div className={styles.userPage_card}>
                <h4>公告</h4>
                <div
                  dangerouslySetInnerHTML={{
                    __html: user_introduce
                  }}
                />
              </div>
            )}
            {/* 签到区域 */}
            <div className={styles.userPage_card}>
              <h4>签到日历（{formatTime('yyyy年MM月', new Date(monthDays[0]))}）</h4>
              <Space direction="vertical">
                <div className={styles.userPage_signin}>
                  {monthDays.map((item) => {
                    const itemClassName = userMonthDays.includes(item)
                      ? `${styles.userPage_signin_item} ${styles.userPage_signin_selectTtem}`
                      : styles.userPage_signin_item
                    return (
                      <div key={item} className={itemClassName}>
                        <p>
                          {formatTime('dd', new Date(item)) === formatTime('dd')
                            ? '今'
                            : formatTime('dd', new Date(item))}
                        </p>
                        <p>{monthAbbreviations[Number(formatTime('MM', new Date(item))) - 1]}</p>
                      </div>
                    )
                  })}
                </div>
                <Button
                  loading={signinLoading}
                  type="primary"
                  block
                  disabled={!!user_info?.is_signin}
                  onClick={() => {
                    setSigninLoading(true)
                    postSignin()
                      .then((res) => {
                        if (res.code) return
                        userAsync.fetchUserInfo()
                        onFetchSigninList()
                        message.success(res.message)
                      })
                      .finally(() => {
                        setSigninLoading(false)
                      })
                  }}
                >
                  {user_info?.is_signin ? '今日已签到' : '立即签到'}
                </Button>
              </Space>
            </div>
            <div className={styles.userPage_card}>
              <h4>邀请链接/二维码</h4>
              <div className={styles.userPage_invite}>
                <QRCode
                  size={160}
                  value={`${location.origin}/login?invite_code=${user_info?.invite_code}`}
                  color="#1877ff"
                />
                <div className={styles.userPage_invite_info}>
                  <p className={styles.userPage_invite_info_link}>
                    <Typography.Paragraph copyable style={{ marginBottom: 0, color: '#1877ff' }}>
                      邀请链接：{`${location.origin}/login?invite_code=${user_info?.invite_code}`}
                    </Typography.Paragraph>
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: invite_introduce
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.userPage_card}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <h4>邀请提成数据</h4>
                  <Button
                    size="small"
                    onClick={() => {
                      withdrawalForm.resetFields()
                      setWithdrawalInfoModal({
                        open: true
                      })
                    }}
                  >
                    申请提现
                  </Button>
                </div>
                <div className={styles.userPage_invite_data}>
                  <div>
                    <p>今日邀请数量</p>
                    <span>{user_info?.today_invite_count}位</span>
                  </div>
                  <div>
                    <p>今日消费金额</p>
                    <span>{transform.centToYuan(user_info?.subordinate_today_pay_amount)}元</span>
                  </div>
                  <div>
                    <p>总收益</p>
                    <span>{transform.centToYuan(user_info?.all_commission_amount)}元</span>
                  </div>
                  <div>
                    <p>余额</p>
                    <span>{transform.centToYuan(user_info?.current_amount)}元</span>
                  </div>
                </div>
                <Segmented
                  defaultValue={tableOptions.type}
                  value={tableOptions.type}
                  onChange={(e) => {
                    setTableOptions((options) => ({ ...options, page: 1, type: e, loading: true }))
                    onUserRecords({ ...tableOptions, page: 1, type: e })
                  }}
                  block
                  options={[
                    {
                      label: '邀请记录',
                      value: 'invitation_records'
                    },
                    {
                      label: '消费记录',
                      value: 'consume_records'
                    },
                    {
                      label: '提现记录',
                      value: 'withdrawal_records'
                    }
                  ]}
                />
                <Table
                  scroll={{
                    x: 800
                  }}
                  bordered
                  loading={tableOptions.loading}
                  pagination={false}
                  rowKey="id"
                  dataSource={getTableData.rows}
                  columns={getTableColumns}
                />
                <div style={{ textAlign: 'right' }}>
                  <Pagination
                    size="small"
                    current={tableOptions.page}
                    defaultCurrent={tableOptions.page}
                    defaultPageSize={tableOptions.page_size}
                    total={getTableData.count}
                    onChange={(page: number, pageSize: number) => {
                      onUserRecords({ page, page_size: pageSize, type: tableOptions.type })
                    }}
                    hideOnSinglePage
                  />
                </div>
              </Space>
            </div>
          </Space>
        </div>
      </Layout>

      <ModalForm
        width={500}
        title={userAccountModal.title}
        open={userAccountModal.open}
        form={userAccountForm}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setUserAccountModal((ua) => ({ ...ua, open: false }))
          },
          okText: '提交'
        }}
        onFinish={(values) => {
          return fetchUserPassword(values)
            .then((res) => {
              if (res.code) return false
              message.success('重置成功')
              navigate('/login')
              return true
            })
            .catch(() => {
              return false
            })
        }}
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />
          }}
          name="account"
          disabled
          rules={[
            {
              required: true,
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
          placeholder="验证码"
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
            const account = userAccountForm.getFieldValue('account')
            return new Promise((resolve, reject) =>
              getCode({ source: account })
                .then(() => resolve())
                .catch(reject)
            )
          }}
        />
        {userAccountModal.type === 'password' && (
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '8位及以上字母数字',
                pattern: /^(?:[a-zA-Z]{8,}|\d{8,}|(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,})$/
              }
            ]}
          />
        )}

        {/*
                    {
                        userAccountModal.type === 'account' && (
                            <>
                                <ProFormText
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <MailOutlined />
                                    }}
                                    name="new_account"
                                    placeholder="新邮箱"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入电子邮箱',
                                            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
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
                                    placeholder="验证码"
                                    captchaTextRender={(timing, count) => {
                                        if (timing) {
                                            return `${count} ${'获取验证码'}`
                                        }
                                        return '获取验证码'
                                    }}
                                    name="new_code"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入验证码！'
                                        }
                                    ]}
                                    onGetCaptcha={async () => {
                                        const new_account = userAccountForm.getFieldValue('new_account')
                                        if (!new_account || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(new_account)) {
                                            userAccountForm.setFields([
                                                {
                                                    name: 'new_account',
                                                    errors: ['请输入有效的邮箱地址']
                                                }
                                            ])
                                            return Promise.reject()
                                        }
                                        return new Promise((resolve, reject) =>
                                            getCode({ source: new_account })
                                                .then(() => resolve())
                                                .catch(reject)
                                        )
                                    }}
                                />
                            </>
                        )
                    }
                */}
      </ModalForm>

      <ModalForm<WithdrawalRecordInfo>
        title="申请提现"
        form={withdrawalForm}
        open={withdrawalInfoModal.open}
        initialValues={{
          status: 1,
          type: 'alipay'
        }}
        onOpenChange={(visible) => {
          setWithdrawalInfoModal({
            open: visible
          })
        }}
        onFinish={async (values) => {
          const res = await fetchUserWithdrawal({
            ...values
          })
          if (res.code) {
            message.error('申请提现失败')
            return false
          }
          withdrawalForm.resetFields()
          message.success('申请提现成功')
		  onUserRecords({
			...tableOptions
		  })
          return true
        }}
        size="large"
        modalProps={{
          cancelText: '取消',
          okText: '提交'
        }}
      >
        <ProFormGroup>
          <ProFormText
            name="name"
            label="实名姓名"
            rules={[{ required: true, message: '请输入支付方实名姓名' }]}
          />
          <ProFormText
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式' }]}
          />
          <ProFormText name="account" label="收款账号" rules={[{ required: true }]} />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormRadio.Group
            name="type"
            label="收款方式"
            radioType="button"
            options={[
              {
                label: '微信支付',
                value: 'wxpay'
              },
              {
                label: 'QQ支付',
                value: 'qqpay'
              },
              {
                label: '支付宝',
                value: 'alipay'
              }
            ]}
            rules={[{ required: true }]}
          />
        </ProFormGroup>
        <ProFormTextArea
          fieldProps={{
            autoSize: {
              minRows: 2,
              maxRows: 2
            }
          }}
          name="message"
          label="留言给管理员"
        />
      </ModalForm>
    </div>
  )
}

export default UserPage
