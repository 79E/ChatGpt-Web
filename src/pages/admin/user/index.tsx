import UserHead from '@/components/UserHead'
import { delAdminUsers, getAdminUsers, putAdminUsers } from '@/request/adminApi'
import { UserInfo } from '@/types/admin'
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
import { Tag, Button, Space, message, Form } from 'antd'
import { useRef, useState } from 'react'

function UserPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<UserInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: UserInfo | undefined
  }>({
    open: false,
    info: undefined
  })
  const columns: ProColumns<UserInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '账号',
      width: 200,
      dataIndex: 'account'
    },
    {
      title: '积分',
      width: 100,
      dataIndex: 'integral',
      render: (_, data) => <a>{data.integral}分</a>
    },
    {
      title: '会员到期时间',
      dataIndex: 'vip_expire_time',
      render: (_, data) => {
        const today = new Date()
        const todayTime = today.getTime()
        const userSubscribeTime = new Date(data.vip_expire_time).getTime()
        return (
          <Space wrap>
            <Tag>{data.vip_expire_time}</Tag>
            {userSubscribeTime < todayTime && <Tag color="red">已过期</Tag>}
          </Space>
        )
      }
    },
    {
      title: '超级会员到期时间',
      dataIndex: 'svip_expire_time'
    },
    {
      title: '用户信息',
      dataIndex: 'user_id',
      width: 160,
      render: (_, data) => {
        return <UserHead headimgurl={data.avatar} nickname={data.nickname} />
      }
    },
    {
      title: 'ip',
      dataIndex: 'ip'
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
            delAdminUsers({
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
          const res = await getAdminUsers({
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
      <ModalForm<UserInfo>
        title="用户信息"
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
          const res = await putAdminUsers({
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
            width="md"
            name="account"
            label="用户账号"
            rules={[{ required: true, message: '请输入用户账号' }]}
          />
          <ProFormRadio.Group
            name="role"
            label="角色"
            radioType="button"
            options={[
              {
                label: '用户',
                value: 'user'
              },
              {
                label: '管理员',
                value: 'administrator'
              }
            ]}
            rules={[{ required: true, message: '请输入剩余积分' }]}
          />
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
            rules={[{ required: true, message: '请输入剩余积分' }]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText
            name="nickname"
            label="用户名称"
            rules={[{ required: true, message: '请输入用户名称' }]}
          />
          <ProFormText
            width="lg"
            name="avatar"
            label="用户头像"
            rules={[{ required: true, message: '请输入用户头像' }]}
          />
        </ProFormGroup>

        <ProFormGroup>
          <ProFormDigit
            label="剩余积分"
            name="integral"
            min={0}
            max={1000000}
            rules={[{ required: true, message: '请输入剩余积分' }]}
          />
          <ProFormDateTimePicker
            name="vip_expire_time"
            label="会员截止日期"
            rules={[{ required: true, message: '请输入剩余积分' }]}
          />
          <ProFormDateTimePicker
            name="svip_expire_time"
            label="超级会员截止日期"
            rules={[{ required: true, message: '请输入剩余积分' }]}
          />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default UserPage
