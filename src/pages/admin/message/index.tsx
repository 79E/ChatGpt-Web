import { delAdminMessage, getAdminMessages, putAdminMessage } from '@/request/adminApi'
import { MessageInfo } from '@/types/admin'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Avatar, Button, Tag, message } from 'antd'
import { useRef } from 'react'

function MessagePage() {
  const tableActionRef = useRef<ActionType>()
  const columns: ProColumns<MessageInfo>[] = [
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
        if (!data.user_id) return '-'
        return <p>{data.user?.account}</p>
      }
    },
    {
      title: '内容',
      dataIndex: 'content'
    },
    {
      title: 'AI角色',
      dataIndex: 'role',
      width: 130,
      render: (_, data) => (
        <Tag color={data.role.includes('user') ? 'cyan' : 'green'}>{data.role}</Tag>
      )
    },
    {
      title: '内置AI角色',
      dataIndex: 'persona_id',
      width: 130,
      render: (_, data) => {
        if (!data.persona || !data.persona_id) {
          return <span>-</span>
        }
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#f5f5f5',
              padding: 4,
              borderRadius: 4
            }}
          >
            <Avatar src={data.persona.avatar} size={24} />
            <span>{data.persona.title}</span>
          </div>
        )
      }
    },
    {
      title: 'AI插件',
      dataIndex: 'plugin_id',
      width: 150,
      render: (_, data) => {
        if (!data.plugin_id || !data.plugin) {
          return <span>-</span>
        }
        return (
          <div
            style={{
              textAlign: 'center',
              background: '#f5f5f5',
              padding: 4,
              borderRadius: 4
            }}
          >
            <img src={data.plugin.avatar} style={{
              width: 50,
              height: 'auto'
            }}
            />
            <p>{data.plugin.name}</p>
          </div>
        )
      }
    },
    {
      title: '模型',
      dataIndex: 'model',
      width: 180,
      render: (_, data) => (
        <Tag color={data.model.includes('gpt-4') ? 'purple' : ''}>{data.model}</Tag>
      )
    },
    {
      title: '会话ID',
      dataIndex: 'parent_message_id',
      width: 300,
      render: (_, data) => <Tag>{data.parent_message_id}</Tag>
    },
    {
      title: '状态值',
      dataIndex: 'status',
      width: 100,
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? '展示' : '隐藏'}</Tag>
      )
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'create_time'
    },
    {
      title: '更新时间',
      width: 200,
      dataIndex: 'update_time'
    },
    {
      title: '操作',
      width: 160,
      valueType: 'option',
      fixed: 'right',
      render: (_, data) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            putAdminMessage({
              ...data,
              id: data.id,
              status: Number(data.status) === 1 ? 0 : 1
            }).then((res) => {
              if (res.code) return
              message.success(res.message)
              tableActionRef.current?.reload()
            })
          }}
        >
          {Number(data.status) ? '隐藏' : '显示'}
        </Button>,
        <Button
          key="del"
          type="text"
          danger
          onClick={() => {
            delAdminMessage({
              id: data.id
            }).then((res) => {
              if (res.code) return
              message.success(res.message)
              tableActionRef.current?.reload()
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
        scroll={{
          x: 2200
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getAdminMessages({
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
    </div>
  )
}

export default MessagePage
