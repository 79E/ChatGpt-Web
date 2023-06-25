import UserHead from '@/components/UserHead'
import {
  delAdminAmountDetails,
  getAdminAmountDetails,
  putAdminAmountDetails,
  postAdminAmountDetails
} from '@/request/adminApi'
import { AmountDetailInfo, UserInfo } from '@/types/admin'
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
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Tag, Button, Space, message, Form, Popover, Typography } from 'antd'
import { useRef, useState } from 'react'

function UserPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<AmountDetailInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: AmountDetailInfo | undefined
  }>({
    open: false,
    info: undefined
  })
  const columns: ProColumns<AmountDetailInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '账号',
      width: 200,
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
      title: '修改前金额(分)',
      dataIndex: 'original_amount',
      render: (_, data) => {
        return <a>{data.original_amount}分</a>
      }
    },
    {
      title: '操作金额(分)',
      dataIndex: 'operate_amount',
      render: (_, data) => {
        return (
          <a>{Number(data.operate_amount) > 0 ? `+${data.operate_amount}分` : `${data.operate_amount}分`}</a>
        )
      }
    },
    {
      title: '当前金额(分)',
      dataIndex: 'current_amount',
      render: (_, data) => {
        return <a>{data.current_amount}分</a>
      }
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      render: (_, data) => {
        if (data.type === 'cashback') {
          return <Tag color="green">下级消费回扣</Tag>
        }
        if (data.type === 'withdrawal') {
          return <Tag color="blue">提现</Tag>
        }
        return <Tag color="red">异常</Tag>
      }
    },
    {
      title: '备注',
      dataIndex: 'remarks'
    },
    {
      title: '关联订单号',
      dataIndex: 'correlation_id'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, data) => {
        return <Tag color="green">{data.status === 1 ? '正常' : '异常'}</Tag>
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
      width: 150,
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
            delAdminAmountDetails({
              id: data.id
            }).then((res) => {
              if (res.code) return
              message.success('删除成功')
              tableActionRef.current?.reloadAndRest?.()
            })
          }}
        >
          删除
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
          const res = await getAdminAmountDetails({
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
          actions: [
            <Button
              key="add"
              size="small"
              type="primary"
              onClick={() => {
                setEditInfoModal({
                  open: true,
                  info: undefined
                })
              }}
            >
              新增记录
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />

      <ModalForm<AmountDetailInfo>
        title="金额明细信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          type: 'cashback'
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
          if (edidInfoModal.info?.id) {
            const res = await putAdminAmountDetails({
              ...values,
              id: edidInfoModal.info?.id
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
          } else {
			const res = await postAdminAmountDetails({
				...values,
			})
			if (res.code) {
				message.error('新增是吧')
				return false
			}
		  }
		  message.success('操作成功')
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
            width="md"
            tooltip="鼠标放在用户名上即可获取"
            name="user_id"
            label="用户ID"
            rules={[{ required: true }]}
          />
          <ProFormText
            width="md"
            tooltip="支付订单号或者提现订单号"
            name="correlation_id"
            label="关联订单号"
            rules={[{ required: true }]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormDigit
            label="上一次剩余金额(分)"
            name="original_amount"
            min={0}
            max={9999999}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            label="操作金额(分)"
            name="operate_amount"
            min={-9999999}
            max={9999999}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            label="当前剩余金额(分)"
            name="current_amount"
            min={0}
            max={9999999}
            rules={[{ required: true }]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormRadio.Group
            name="status"
            label="状态"
            radioType="button"
            options={[
              {
                label: '异常',
                value: 0
              },
              {
                label: '正常',
                value: 1
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormRadio.Group
            name="type"
            label="操作类型"
            radioType="button"
            options={[
              {
                label: '下级消费回扣',
                value: 'cashback'
              },
              {
                label: '提现',
                value: 'withdrawal'
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText
            width="md"
            name="remarks"
            label="备注"
            rules={[{ required: true, message: '备注' }]}
          />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default UserPage
