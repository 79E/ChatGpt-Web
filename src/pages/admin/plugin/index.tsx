import {
  getAdminPlugins,
  delAdminPlugin,
  postAdminPlugin,
  putAdminPlugin
} from '@/request/adminApi'
import { PluginInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Avatar, Button, Form, Space, Tag, Tooltip, message } from 'antd'
import { useRef, useState } from 'react'
import FormCard from '../components/FormCard'
import { QuestionOutlined } from '@ant-design/icons'
import CodeEditor from '@/components/CodeEditor'

const functionJson = `{
	"name": "fun_name",
	"description": "fun_name description",
	"parameters": {
		"type": "object",
		"properties": {
			"ip": {
				"type": "string",
				"description": "ip address, eg:1.1.1.1"
			}
		},
		"required": [
			"ip"
		]
	}
}
`

const functionScript = `function fun_name(params) {
	const { ip } = params;
	console.log(ip);
}
`

function PluginPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<PluginInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: PluginInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<PluginInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180,
      render: (_, data) => <a>{data.id}</a>
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (_, data) => {
        return (
          <Space>
            <img
              src={data.avatar}
              style={{
                width: 32
              }}
            />
            <span>{data.name}</span>
          </Space>
        )
      }
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '状态值',
      dataIndex: 'status',
      render: (_, data) => {
        if (data.status === 4) {
          return <Tag color="orange">等待审核</Tag>
        }
        return <Tag color={data.status ? 'green' : 'red'}>{data.status ? '上架' : '下架'}</Tag>
      }
    },
    {
      title: '上传用户',
      dataIndex: 'user_id',
      render: (_, data) => <a>{data.user?.account}</a>
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
      width: 160,
      valueType: 'option',
      fixed: 'right',
      render: (_, data) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setEditInfoModal(() => {
              form?.setFieldsValue({
                ...data,
                variables: data.variables ? JSON.parse(data.variables) : []
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
            delAdminPlugin({
              id: data.id
            }).then((res) => {
              if (res.code) return
              message.success('删除成功')
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
          const res = await getAdminPlugins({
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
                    info: undefined
                  }
                })
              }}
            >
              新增插件
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<PluginInfo>
        title="插件信息"
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
          if (!edidInfoModal.info?.script || !edidInfoModal.info?.function) {
            message.warning('缺少必要参数')
            return false
          }
          const data = {
            ...values,
            id: edidInfoModal.info?.id,
            script: edidInfoModal.info?.script,
            function: edidInfoModal.info?.function,
            variables: values.variables ? JSON.stringify(values.variables) : undefined
          }

          if (data?.id) {
            const res = await putAdminPlugin({
              ...data
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await postAdminPlugin(data)
            if (res.code) {
              message.error('新增失败')
              return false
            }
            tableActionRef.current?.reloadAndRest?.()
            message.success('提交成功')
          }
          return true
        }}
        size="large"
        modalProps={{
          cancelText: '取消',
          okText: '提交',
          style: {
            top: 10
          }
        }}
      >
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
            placeholder="插件头像链接"
            rules={[{ required: true, message: '请输入插件头像链接' }]}
          />
          <ProFormText
            name="name"
            label="名称"
            placeholder="插件名称"
            rules={[{ required: true, message: '请输入插件名称' }]}
          />
        </ProFormGroup>
        <ProFormText
          name="description"
          label="描述"
          placeholder="插件描述"
          rules={[{ required: true, message: '请输入插件描述' }]}
        />
        <ProFormList
          name="variables"
          label="环境变量"
          creatorButtonProps={{
            creatorButtonText: '添加环境变量'
          }}
        >
          <ProFormGroup key="group">
            <ProFormText name="label" label="变量名称" rules={[{ required: true }]} />
            <ProFormText name="value" label="变量值" rules={[{ required: true }]} />
          </ProFormGroup>
        </ProFormList>
        <FormCard title="插件函数描述">
          <CodeEditor
            value={edidInfoModal.info?.function}
            defaultValue={functionJson}
            placeholder="请输入json格式"
            mode="json"
            onChange={(v) => {
              setEditInfoModal((modalInfo) => {
                const info = {
                  ...modalInfo.info,
                  function: v
                }
                return {
                  ...modalInfo,
                  info
                } as any
              })
            }}
          />
        </FormCard>
        <FormCard title="插件函数脚本">
          <CodeEditor
            value={edidInfoModal.info?.script}
            defaultValue={functionScript}
            placeholder="请输入javaScript格式代码"
            mode="javascript"
            onChange={(v) => {
              setEditInfoModal((modalInfo) => {
                const info = {
                  ...modalInfo.info,
                  script: v
                }
                return {
                  ...modalInfo,
                  info
                } as any
              })
            }}
          />
        </FormCard>
        <ProFormGroup>
          <ProFormText name="user_id" label="用户ID" placeholder="插件上传者的ID" />
          <ProFormRadio.Group
            name="status"
            label="状态"
            radioType="button"
            options={[
              {
                label: '下架',
                value: 0
              },
              {
                label: '上架',
                value: 1
              },
              {
                label: '审核中',
                value: 4
              }
            ]}
          />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default PluginPage
