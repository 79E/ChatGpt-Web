import UserHead from '@/components/UserHead'
import {
  delAdminWithdrawalRecord,
  putAdminWithdrawalRecord,
  getAdminWithdrawalRecords,
  putAdminWithdrawalRecordOperate
} from '@/request/adminApi'
import { WithdrawalRecordInfo } from '@/types/admin'
import { transform } from '@/utils'
import { SecurityScanFilled } from '@ant-design/icons'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Tag, Button, Space, message, Form, Typography, Popover, Descriptions } from 'antd'
import { useRef, useState } from 'react'

function UserPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<WithdrawalRecordInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: WithdrawalRecordInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const [optionInfoModal, setOptionInfoModal] = useState<{
    open: boolean
    info: WithdrawalRecordInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  function getPayType(type: string) {
    switch (type) {
      case 'wxpay':
        return '微信支付'
      case 'qqpay':
        return 'QQ支付'
      case 'alipay':
        return '支付宝'
      default:
        return '无'
    }
  }

  const columns: ProColumns<WithdrawalRecordInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '用户账号',
      width: 180,
      dataIndex: 'user_id',
      render: (_, data) => {
        return (
          <Popover
            content={<Typography.Paragraph copyable>{data?.user_id}</Typography.Paragraph>}
            title="用户ID"
          >
            <Tag>
              <SecurityScanFilled /> {data?.user?.account || data?.user_id}
            </Tag>
          </Popover>
        )
      }
    },
    {
      title: '提现金额(分)',
      dataIndex: 'amount',
      render: (_, data) => {
        return <Tag color="red">{data.amount}分</Tag>
      }
    },
    {
      title: '提现人信息',
      render: (_, data) => {
        const payTypeText = getPayType(data.type)
        return (
          <Space wrap direction="vertical">
            <p>
              收款人名：<Tag color="blue">{data.name}</Tag>
            </p>
            <p>
              联系方式：<Tag color="cyan">{data.contact}</Tag>
            </p>
            <p>
              收款方式：<Tag color="green">{payTypeText}</Tag>
            </p>
            <p>
              收款账号：<Tag color="gold">{data.account}</Tag>
            </p>
          </Space>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, data) => {
        if (data.status === 3) {
          return <Tag color="orange">打款审核</Tag>
        }
        if (data.status === 1) {
          return <Tag color="orange">提现成功</Tag>
        }
        return <Tag color="red">异常情况</Tag>
      }
    },
    {
      title: '备注/回复',
      dataIndex: 'remarks'
    },
    {
      title: '用户留言',
      dataIndex: 'message'
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      render: (_, data) => {
        return <Tag>{data.ip}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time'
    },
    {
      title: '操作',
      width: 220,
      valueType: 'option',
      fixed: 'right',
      render: (_, data) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setEditInfoModal(() => {
              form?.setFieldsValue({
                ...data
              })
              return {
                open: true,
                info: data
              }
            })
          }}
        >
          编辑
        </Button>,
        <Button
          key="del"
          type="text"
          danger
          onClick={() => {
            delAdminWithdrawalRecord({
              id: data.id
            }).then((res) => {
              if (res.code) return
              message.success('删除成功')
              tableActionRef.current?.reloadAndRest?.()
            })
          }}
        >
          删除
        </Button>,
        <Button
          key="option"
          type="text"
          danger
          disabled={data.status != 3}
          onClick={() => {
            setOptionInfoModal(() => {
              form?.setFieldsValue({
                ...data
              })
              return {
                open: true,
                info: data
              }
            })
          }}
        >
          操作
        </Button>
      ]
    }
  ]

  return (
    <div>
      <ProTable
        actionRef={tableActionRef}
        columns={columns}
        params={{}}
        pagination={{}}
        scroll={{
          x: 1800
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getAdminWithdrawalRecords({
            page: params.current || 1,
            page_size: params.pageSize || 10
          })
          return Promise.resolve({
            data: res.data.rows,
            total: res.data.count,
            success: true
          })
        }}
        toolbar={{
          actions: []
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<WithdrawalRecordInfo>
        title="提现详情"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          type: 'alipay'
        }}
        onOpenChange={(visible) => {
          if (!visible) {
            form.resetFields()
          }
          setEditInfoModal((info) => {
            return {
              ...info,
              open: visible
            }
          })
        }}
        onFinish={async (values) => {
          if (!edidInfoModal.info?.id) return false
          const res = await putAdminWithdrawalRecord({
            ...values,
            id: edidInfoModal.info?.id
          })
          if (res.code) {
            message.error('编辑失败')
            return false
          }
          tableActionRef.current?.reload?.()
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
            tooltip="鼠标放在用户名上即可获取"
            name="user_id"
            label="用户ID"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="name"
            label="用户名称"
            rules={[{ required: true, message: '请输入用户名称' }]}
          />
          <ProFormText
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入用户联系方式' }]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormDigit
            label="提现金额(分)"
            name="amount"
            min={0}
            max={1000000}
            rules={[{ required: true }]}
          />
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
          <ProFormText name="account" label="收款账号" rules={[{ required: true }]} />
        </ProFormGroup>

        <ProFormGroup>
          <ProFormRadio.Group
            name="status"
            label="状态"
            radioType="button"
            disabled
            options={[
              {
                label: '异常情况',
                value: 0
              },
              {
                label: '提现成功',
                value: 1
              },
              {
                label: '打款审核',
                value: 3
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText width="md" name="remarks" label="备注/回复" rules={[{ required: true }]} />
        </ProFormGroup>
        <ProFormTextArea
          fieldProps={{
            autoSize: {
              minRows: 2,
              maxRows: 2
            }
          }}
          name="message"
          label="用户留言"
        />
      </ModalForm>
      <ModalForm<WithdrawalRecordInfo>
        title="提现操作"
        open={optionInfoModal.open}
        form={form}
        initialValues={{
          status: 1
        }}
        onOpenChange={(visible) => {
          if (!visible) {
            form.resetFields()
          }
          setOptionInfoModal((info) => {
            return {
              ...info,
              open: visible
            }
          })
        }}
        onFinish={async (values) => {
          if (!optionInfoModal.info?.id) return false
          const res = await putAdminWithdrawalRecordOperate({
            ...values,
            status: values.new_status || 0,
            id: optionInfoModal.info?.id
          })
          if (res.code) {
            message.error('操作失败')
            return false
          }
          tableActionRef.current?.reload?.()
          return true
        }}
        size="large"
        modalProps={{
          cancelText: '取消',
          okText: '提交'
        }}
      >
        <Descriptions bordered size="small">
          <Descriptions.Item label="名称" span={2}>
            {optionInfoModal.info?.name}
          </Descriptions.Item>
          <Descriptions.Item label="联系方式" span={2}>
            {optionInfoModal.info?.contact}
          </Descriptions.Item>
          <Descriptions.Item label="收款方式">{optionInfoModal.info?.type}</Descriptions.Item>
          <Descriptions.Item label="收款账号">{optionInfoModal.info?.account}</Descriptions.Item>
          <Descriptions.Item label="提现金额">
            {transform.centToYuan(optionInfoModal.info?.amount)}元
          </Descriptions.Item>
          <Descriptions.Item label="用户留言" span={3}>
            {optionInfoModal.info?.message}
          </Descriptions.Item>
        </Descriptions>
        <ProFormGroup>
          <ProFormRadio.Group
            name="new_status"
            label="提现状态"
            radioType="button"
            tooltip="注意修改后不可更改"
            options={[
              {
                label: '异常情况',
                value: 0
              },
              {
                label: '提现成功',
                value: 1
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText width="lg" name="remarks" label="备注/回复" rules={[{ required: true }]} />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default UserPage
