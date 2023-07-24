import { Avatar, Button, Form, Popover, Tag, message } from 'antd'
import { useRef, useState } from 'react'
import {
  delAdminPersona,
  getAdminPersonas,
  postAdminPersona,
  putAdminPersona
} from '@/request/adminApi'
import { DialogInfo, PersonaInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { QuestionOutlined } from '@ant-design/icons'
import FormCard from '../components/FormCard'

function PersonaPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<PersonaInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: PersonaInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<PersonaInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '头像/标题',
      width: 180,
      dataIndex: 'title',
      render: (_, data) => {
        return (
          <a
            onClick={() => {
              setEditInfoModal(() => {
                form.setFieldsValue({
                  ...data,
                  context: JSON.parse(data.context)
                })
                return {
                  open: true,
                  info: data
                }
              })
            }}
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {data.avatar && <Avatar size={24} src={data.avatar} />}
            <span>{data.title}</span>
          </a>
        )
      }
    },
    {
      title: '内置话术',
      dataIndex: 'context',
      render: (_, data) => {
        if (!data.context) return <span>-</span>
        const context = JSON.parse(data.context)
        return (
          <a
            onClick={() => {
              setEditInfoModal(() => {
                form.setFieldsValue({
                  ...data,
                  context: JSON.parse(data.context)
                })
                return {
                  open: true,
                  info: data
                }
              })
            }}
          >
            包含<span style={{ color: 'red', fontWeight: 'bold' }}> {context.length} </span>
            条预设对话
          </a>
        )
      }
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '用户',
      dataIndex: 'user_id',
      render: (_, data) => {
        if (!data.user_id) return '-'
        return <p>{data.user?.account}</p>
      }
    },
    {
      title: '状态值',
      width: 100,
      dataIndex: 'status',
      render: (_, data) => {
        if (data.status === 4) {
          return <Tag color="orange">等待审核</Tag>
        }
        return <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '隐藏'}</Tag>
      }
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
            setEditInfoModal(() => {
              form.setFieldsValue({
                ...data,
                context: JSON.parse(data.context)
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
            delAdminPersona({
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
          x: 1600
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getAdminPersonas({
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
              key="primary"
              type="primary"
              size="small"
              onClick={() => {
                setEditInfoModal(() => {
                  return {
                    open: true,
                    info: {
                      emoji: '1f970'
                    } as any
                  }
                })
              }}
            >
              新增角色
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<PersonaInfo>
        title="角色信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          system: 0
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
          const data = { ...values }
          if (!data.context || data.context.length <= 0) {
            message.warning('请填写对话数据')
            return
          }
          const context = JSON.stringify(data.context)
          if (edidInfoModal.info?.id) {
            const res = await putAdminPersona({
              ...data,
              context,
              id: edidInfoModal.info?.id
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
          } else {
            const res = await postAdminPersona({
              ...data,
              context
            })
            if (res.code) {
              message.error('新增失败')
              return false
            }
          }
          tableActionRef.current?.reloadAndRest?.()
          message.success('提交成功')
          return true
        }}
        size="large"
        modalProps={{
          cancelText: '取消',
          okText: '提交'
        }}
      >
        <ProFormList
          name="context"
          creatorButtonProps={{
            creatorButtonText: '添加一行对话'
          }}
        >
          <ProFormGroup key="group">
            <ProFormSelect
              label="角色"
              name="role"
              width="sm"
              valueEnum={{
                system: 'system',
                user: 'user',
                assistant: 'assistant'
              }}
              rules={[{ required: true }]}
            />
            <ProFormText width="lg" rules={[{ required: true }]} name="content" label="内容" />
          </ProFormGroup>
        </ProFormList>
        <ProFormGroup>
          <ProFormDependency name={['avatar']}>
            {({ avatar }) => {
              return (
                <FormCard title="头像" type="avatar">
                  {avatar ? (
                    <img
                      src={avatar}
                      style={{
                        width: '100%'
                      }}
                    />
                  ) : (
                    <QuestionOutlined />
                  )}
                </FormCard>
              )
            }}
          </ProFormDependency>
          <ProFormText
            width="md"
            name="avatar"
            label="头像链接"
            placeholder="头像链接"
            rules={[{ required: true, message: '请输入头像链接' }]}
          />
          <ProFormText
            name="title"
            label="标题"
            placeholder="标题"
            rules={[{ required: true, message: '请输入角色标题' }]}
          />
        </ProFormGroup>
        <ProFormText name="description" label="描述" placeholder="描述" />
        <ProFormGroup>
          <ProFormRadio.Group
            name="status"
            label="状态"
            radioType="button"
            options={[
              {
                label: '下线',
                value: 0
              },
              {
                label: '上线',
                value: 1
              },
              {
                label: '审核中',
                value: 4
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormRadio.Group
            name="system"
            label="角色级别"
            radioType="button"
            options={[
              {
                label: '用户',
                value: 0
              },
              {
                label: '系统级',
                value: 1
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormText width="md" name="user_id" label="用户ID" placeholder="用户ID" />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default PersonaPage
