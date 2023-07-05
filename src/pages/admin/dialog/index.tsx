import { Button, Form, Tag, message } from 'antd'
import { useRef, useState } from 'react'
import {
  delAdminDialog,
  getAdminDialogs,
  postAdminDialog,
  putAdminDialog
} from '@/request/adminApi'
import { DialogInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'

function DialogPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<
    DialogInfo & {
      models: Array<string>
    }
  >()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: DialogInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<DialogInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '问题',
      width: 180,
      dataIndex: 'issue'
    },
    {
      title: '回答',
      dataIndex: 'answer'
    },
    {
      title: '适用模型',
      width: 200,
      dataIndex: 'models',
      render: (_, data) => {
        if (!data.models) return '-'
        const modelTag = data.models.split(',').map((model) => {
          return <Tag key={model}>{model}</Tag>
        })
        return <>{modelTag}</>
      }
    },
    {
      title: '延迟时间',
      width: 120,
      dataIndex: 'delay',
      render: (_, data) => (
        <Tag>{`随机0-${data.delay}毫秒`}</Tag>
      )
    },
    {
      title: '状态值',
      width: 100,
      dataIndex: 'status',
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '隐藏'}</Tag>
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
            setEditInfoModal(() => {
              const models = data.models ? data.models.split(',') : []
              form?.setFieldsValue({
                ...data,
                models
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
            delAdminDialog({
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
          const res = await getAdminDialogs({
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
              新增对话
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<
        DialogInfo & {
          models: Array<string>
        }
      >
        title="商品信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          level: 1,
          sort: 1,
          delay: 100
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
          const models = data.models.join(',')
          if (edidInfoModal.info?.id) {
            const res = await putAdminDialog({
              ...data,
              models,
              id: edidInfoModal.info?.id
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await postAdminDialog({
              ...data,
              models
            })
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
          okText: '提交'
        }}
      >
        <ProFormGroup>
          <ProFormText
            width="lg"
            name="issue"
            label="问题"
            placeholder="问题"
            rules={[{ required: true, message: '请输入对话问题' }]}
          />
        </ProFormGroup>
        <ProFormTextArea
          name="answer"
          label="回答"
          placeholder="输入对于问题的正确回答"
          fieldProps={{
            autoSize: {
              minRows: 2,
              maxRows: 6
            }
          }}
          rules={[{ required: true, message: '请输入答案' }]}
        />
        <ProFormGroup>
          <ProFormDigit
            label="最大延迟(毫秒)"
            name="delay"
            min={0}
            max={9999999}
            rules={[{ required: true }]}
          />
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
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="models"
            label="适用模型"
            options={[
              {
                label: '全部GPT4类型',
                value: 'gpt-4'
              },
              {
                label: '全部GPT3类型',
                value: 'gpt-3'
              }
            ]}
            fieldProps={{
              mode: 'multiple'
            }}
            placeholder="请选择当前对话可用于的AI模型"
            rules={[
              {
                required: true,
                message: '请选择当前对话可用于的AI模型!'
              }
            ]}
          />
        </ProFormGroup>

      </ModalForm>
    </div>
  )
}

export default DialogPage
