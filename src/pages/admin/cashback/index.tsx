import UserHead from '@/components/UserHead'
import { delAdminCashback, getAdminCashback, putAdminCashback, putAdminCashbackPass } from '@/request/adminApi'
import { CashbackInfo } from '@/types/admin'
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
import { Tag, Button, Space, message, Form, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

function UserPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<CashbackInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: CashbackInfo | undefined
  }>({
    open: false,
    info: undefined
  })
  const columns: ProColumns<CashbackInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, data) => {
        if (data.status === 3) {
          return <Tag color="orange">等待审核</Tag>
        }
        if (data.status === 1) {
          return <Tag color="green">正常发放</Tag>
        }
        return <Tag color="red">异常佣金</Tag>
      }
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      title: '消费用户',
      dataIndex: 'user_id',
      width: 160,
      render: (_, data) => {
        return <Tag>{data.user.account}</Tag>
      }
    },
    {
      title: '受益用户',
      dataIndex: 'user_id',
      width: 160,
      render: (_, data) => {
        return <Tag>{data.benefit.account}</Tag>
      }
    },
    {
      title: '消费金额(分)',
      dataIndex: 'pay_amount'
    },
    {
      title: '提成金额(分)',
      dataIndex: 'commission_amount'
    },
    {
      title: '提成百分比(%)',
      dataIndex: 'commission_rate'
    },
    {
      title: '关联订单',
      width: 180,
      dataIndex: 'order_id'
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
      render: (_, data) => {
        const buttons = [
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
              delAdminCashback({
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
        ]
        if (data.status !== 1) {
          buttons.push((
            <Popconfirm
              key="pass"
              placement="topRight"
              title="充值真实性判断"
              description="清判断是否为正常充值！"
              onConfirm={() => {
                putAdminCashbackPass({ id: data.id }).then((res) => {
                  if (res.code) return
                  message.success('通过成功')
                  tableActionRef.current?.reloadAndRest?.()
                })
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
              >
                通过
              </Button>
            </Popconfirm>
          ))
        }
        return [...buttons]
      }
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
          const res = await getAdminCashback({
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
      <ModalForm<CashbackInfo>
        title="提成信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1
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
          const res = await putAdminCashback({
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
          <ProFormRadio.Group
            name="status"
            label="状态"
            radioType="button"
            options={[
              {
                label: '异常状态',
                value: 0
              },
              {
                label: '正常发放',
                value: 1
              },
              {
                label: '正在审核',
                value: 3
              }
            ]}
            rules={[{ required: true, message: '请选择状态' }]}
          />
          <ProFormText
            width="md"
            name="remarks"
            label="备注提醒"
            rules={[{ required: true, message: '请输入备注提醒信息' }]}
          />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default UserPage
