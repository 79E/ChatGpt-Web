import { delAdminInviteRecord, getAdminInviteRecord, putAdminInviteRecord, putAdminInviteRecordPass } from '@/request/adminApi'
import { InviteRecordInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormGroup,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Tag, Button, message, Form, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

function InviteRecordPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<InviteRecordInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: InviteRecordInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<InviteRecordInfo>[] = [
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
        if (data.status) {
          return <Tag color="green">正常发放</Tag>
        }
        return <Tag color="red">异常状态</Tag>
      }
    },
    {
      title: '备注提醒',
      dataIndex: 'remarks'
    },
    {
      title: '邀请者',
      dataIndex: 'superior_id',
      width: 200,
      render: (_, data) => {
        return <Tag>{data.superior.account}</Tag>
      }
    },
    {
      title: '被邀请者',
      dataIndex: 'user_id',
      width: 200,
      render: (_, data) => {
        return <Tag>{data.user.account}</Tag>
      }
    },
    {
      title: '邀请码',
      dataIndex: 'invite_code',
      render: (_, data) => {
        return <Tag>{data.invite_code}</Tag>
      }
    },
    {
      title: '奖励',
      dataIndex: 'reward'
    },
    {
      title: 'ip',
      dataIndex: 'ip'
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
              delAdminInviteRecord({
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
              placement="topRight"
              title="邀请真实性判断"
              description="清判断是否为正常邀请,一旦通过奖励不可以收回！"
              onConfirm={() => {
                putAdminInviteRecordPass({ id: data.id }).then((res) => {
                  if (res.code) return
                  message.success('通过成功')
                  tableActionRef.current?.reloadAndRest?.()
                })
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                key="pass"
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
          const res = await getAdminInviteRecord({
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
            <Button key="allPass" size="small" danger onClick={() => {
              putAdminInviteRecordPass().then((res) => {
                if (res.code) return
                message.success('全部通过成功')
                tableActionRef.current?.reloadAndRest?.()
              })
            }}
            >
              全部通过
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<InviteRecordInfo>
        title="邀请信息"
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
          const res = await putAdminInviteRecord({
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

export default InviteRecordPage
