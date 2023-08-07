import {
  getAdminAikeys,
  delAdminAikey,
  putAdminAikey,
  postAdminAikey,
  postAdminAikeyCheck
} from '@/request/adminApi'
import { AikeyInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDependency,
  ProFormGroup,
  ProFormRadio,
  ProFormSegmented,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Form, Progress, Space, Tag, message } from 'antd'
import { useRef, useState } from 'react'

const getModels = (type: string) => {
  if (type === 'stability') {
    return [
      {
        label: 'stable-diffusion-v1-5',
        value: 'stable-diffusion-v1-5'
      }
    ]
  }
  return [
    {
      label: 'OpenAI(dall-e)绘画',
      value: 'dall-e'
    },
    {
      label: 'gpt-3.5-turbo',
      value: 'gpt-3.5-turbo'
    },
    {
      label: 'gpt-3.5-turbo-16k',
      value: 'gpt-3.5-turbo-16k'
    },
    {
      label: 'gpt-3.5-turbo-0613',
      value: 'gpt-3.5-turbo-0613'
    },
    {
      label: 'gpt-3.5-turbo-16k-0613',
      value: 'gpt-3.5-turbo-16k-0613'
    },
    {
      label: 'text-davinci-003',
      value: 'text-davinci-003'
    },
    {
      label: 'code-davinci-002',
      value: 'code-davinci-002'
    },
    {
      label: 'gpt-4',
      value: 'gpt-4'
    },
    {
      label: 'gpt-4-0613',
      value: 'gpt-4-0613'
    },
    {
      label: 'gpt-4-32k',
      value: 'gpt-4-32k'
    },
    {
      label: 'gpt-4-32k-0613',
      value: 'gpt-4-32k-0613'
    }
  ]
}

function AikeyPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<
    AikeyInfo & {
      models: Array<string>
    }
  >()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: AikeyInfo | undefined
  }>({
    open: false,
    info: undefined
  })
  const columns: ProColumns<AikeyInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180,
      fixed: 'left'
    },
    {
      title: 'KEY',
      dataIndex: 'key',
      width: 200
    },
    {
      title: 'HOST',
      dataIndex: 'host',
      render: (_, data) => {
        return (
          <a href={data.host} target="_blank" rel="noreferrer">
            {data.host}
          </a>
        )
      }
    },
    {
      title: '可用模型',
      dataIndex: 'models',
      width: 200,
      render: (_, data) => {
        if (!data.models) return '-'
        const modelTag = data.models.split(',').map((model) => {
          return <Tag key={model}>{model}</Tag>
        })
        return <>{modelTag}</>
      }
    },
    {
      title: 'AI类型',
      dataIndex: 'type',
      render: (_, data) => <Tag>{data.type}</Tag>
    },
    {
      title: '备注',
      dataIndex: 'remarks'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, data) => (
        <Space direction="vertical">
          <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '异常'}</Tag>
          <Tag color={data.check ? 'green' : 'red'}>
            {data.check ? '检查可用性' : '不检查可用性'}
          </Tag>
        </Space>
      )
    },
    {
      title: '额度',
      dataIndex: 'limit',
      width: 160,
      render: (_, data) => {
        return (
          <div>
            <p>总额：{data.limit.toFixed(2)}</p>
            <p>已用：{data.usage}</p>
            <p>剩余：{(data.limit - data.usage).toFixed(2)}</p>
            <Progress
              percent={Number(((data.usage / data.limit) * 100).toFixed(2))}
              format={() => ''}
              size="small"
            />
          </div>
        )
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
            delAdminAikey({
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

  function getUniqueHosts(arr: Array<AikeyInfo>) {
    const uniqueHosts = new Set<string>()
    uniqueHosts.add('https://api.openai.com')
    uniqueHosts.add('https://openai.api2d.net')
    uniqueHosts.add('https://api.openai-proxy.com')
    uniqueHosts.add('https://api1.openai-proxy.com')
    uniqueHosts.add('https://api2.openai-proxy.com')
    arr.forEach((obj) => uniqueHosts.add(obj.host))
    return Array.from(uniqueHosts).map((host) => ({ label: host, value: host }))
  }
  const [inputHost, setInputHost] = useState<Array<{ label: string; value: string }>>([])
  const [hostOptions, setHostOptions] = useState<Array<{ label: string; value: string }>>([])

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
          const res = await getAdminAikeys({
            page: params.current || 1,
            page_size: params.pageSize || 10
          })

          const hosts = getUniqueHosts(res.data.rows)
          setHostOptions([...hosts])

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
                postAdminAikeyCheck({ all: true }).then(() => {
                  message.success('提交刷新成功，请稍后在查询')
                })
              }}
            >
              异步刷新额度
            </Button>,
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
              新增Aikey
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<
        AikeyInfo & {
          models: Array<string>
        }
      >
        title="Token信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          type: 'openai',
		  check: 0
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
          const models = values.models.join(',')
          if (edidInfoModal.info?.id) {
            const res = await putAdminAikey({
              ...values,
              models,
              id: edidInfoModal.info?.id
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await postAdminAikey({
              ...values,
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
        <ProFormGroup size="large">
          <ProFormSegmented
            label="AI类型"
            name="type"
            fieldProps={{
              options: [],
              size: 'large',
              onChange: (value) => {
                if (value === 'stability') {
                  form.setFieldsValue({
                    host: 'https://api.stability.ai',
                    models: []
                  })
                } else {
                  form.setFieldsValue({
                    host: '',
                    models: []
                  })
                }
              }
            }}
            request={async () => [
              {
                label: 'OpenAI',
                value: 'openai'
              },
              {
                label: 'StableDiffusion',
                value: 'stability'
              }
            ]}
            rules={[{ required: true, message: 'AI类型' }]}
          />
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
              }
            ]}
          />
          <ProFormRadio.Group
            name="check"
            label="检查可用性"
            radioType="button"
            options={[
              {
                label: '不检查',
                value: 0
              },
              {
                label: '检查',
                value: 1
              }
            ]}
          />
        </ProFormGroup>
        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <ProFormSelect.SearchSelect
                name="host"
                label="API地址或代理地址"
                placeholder="请选择或者输入API地址"
                mode="single"
                disabled={type === 'stability'}
                fieldProps={{
                  labelInValue: false,
                  onSearch: (value) => {
                    if (!value) return
                    setInputHost([{ label: value, value }])
                  },
                  onChange: (value: string) => {
                    if (!value) return
                    setHostOptions((hosts) => {
                      setInputHost([])
                      const is = hosts.filter((item) => item.value === value)
                      if (is.length > 0) return [...hosts]
                      return [{ label: value, value }, ...hosts]
                    })
                  }
                }}
                options={[...inputHost, ...hostOptions]}
                rules={[
                  {
                    required: true,
                    message: '请输入正确对应的Host',
                    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*[^\/]$/i
                  }
                ]}
              />
            )
          }}
        </ProFormDependency>
        <ProFormText
          name="key"
          label="Key"
          placeholder="Key"
          rules={[{ required: true, message: '请输入Key' }]}
        />
        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <ProFormSelect
                name="models"
                label="适用模型"
                options={getModels(type)}
                fieldProps={{
                  mode: 'multiple'
                }}
                placeholder="请选择当前Token可用于的AI模型"
                rules={[
                  {
                    required: true,
                    message: '请选择当前Token可用于的AI模型!'
                  }
                ]}
              />
            )
          }}
        </ProFormDependency>
		<ProFormText name="remarks" label="备注" placeholder="备注" />
      </ModalForm>
    </div>
  )
}

export default AikeyPage
