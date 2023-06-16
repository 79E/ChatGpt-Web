import {
  getAdminPayment,
  delAdminPayment,
  addAdminPayment,
  putAdminPayment
} from '@/request/adminApi'
import { AlipayInfo, PaymentInfo, YipayInfo } from '@/types/admin'
import {
  ActionType,
  BetaSchemaForm,
  ModalForm,
  ProColumns,
  ProFormCheckbox,
  ProFormColumnsType,
  ProFormDependency,
  ProFormGroup,
  ProFormSegmented,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Form, Space, Tag, message } from 'antd'
import { useRef, useState } from 'react'

type MIXInfo = PaymentInfo & AlipayInfo & YipayInfo

function PaymentPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<MIXInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: PaymentInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<PaymentInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '渠道名称',
      dataIndex: 'name'
    },
    {
      title: '渠道代码',
      dataIndex: 'channel',
      render: (_, data) => <Tag>{data.channel}</Tag>
    },
    {
      title: '可用通道',
      dataIndex: 'types',
      width: 250,
      render: (_, data) => {
        const typesDom = data.types.split(',').map((type) => {
          return <Tag key={type}>{type}</Tag>
        })
        return <Space>{typesDom}</Space>
      }
    },
    {
      title: '状态值',
      dataIndex: 'status',
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? '上线' : '下线'}</Tag>
      )
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
              const json = JSON.parse(data.params)
              const types = data.types.split(',')
              form?.setFieldsValue({
                ...data,
                ...json,
                types
              })
              return {
                open: true,
                info: {
                  ...data,
                  ...json,
                  types
                }
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
            delAdminPayment({
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

  const payKeyColumns: { [key: string]: Array<ProFormColumnsType> } = {
    alipay: [
      {
        title: '支付宝当面付配置',
        valueType: 'group',
        columns: [
          {
            title: '应用ID appId',
            dataIndex: 'appId',
            width: 'lg',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项'
                }
              ]
            }
          },
          {
            title: '加密类型 keyType',
            dataIndex: 'keyType',
            valueType: 'select',
            width: 's',
            request: async () => [
              {
                label: 'PKCS8',
                value: 'PKCS8'
              },
              {
                label: 'PKCS1',
                value: 'PKCS1'
              }
            ],
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项'
                }
              ]
            }
          }
        ]
      },
      {
        title: '应用私钥 privateKey',
        dataIndex: 'privateKey',
        valueType: 'textarea',
        fieldProps: {
          autoSize: {
            minRows: 2,
            maxRows: 5
          }
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项'
            }
          ]
        }
      },
      {
        title: '支付宝公钥 alipayPublicKey',
        dataIndex: 'alipayPublicKey',
        valueType: 'textarea',
        fieldProps: {
          autoSize: {
            minRows: 2,
            maxRows: 5
          }
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项'
            }
          ]
        }
      }
    ],
    yipay: [
      {
        title: '易支付配置',
        valueType: 'group',
        columns: [
          {
            title: '商户ID',
            dataIndex: 'pid',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项'
                }
              ]
            },
            width: 'md'
          },
          {
            title: '商户密钥',
            dataIndex: 'key',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项'
                }
              ]
            },
            width: 'md'
          },
          {
            title: '接口地址',
            dataIndex: 'api',
            width: 'lg',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项'
                }
              ]
            }
          },
          {
            title: '跳转通知地址 return_url',
            dataIndex: 'return_url',
            width: 'sm'
          }
        ]
      }
    ]
  }

  function changeUpdateData(obj: MIXInfo) {
    const data = {
      name: obj.name,
      status: obj.status,
      channel: obj.channel,
      types: (obj.types as unknown as Array<string>).join(',')
    }
    if (obj.channel === 'alipay') {
      return {
        ...data,
        params: JSON.stringify({
          appId: obj?.appId,
          keyType: obj?.keyType,
          alipayPublicKey: obj?.alipayPublicKey,
          privateKey: obj?.privateKey
        })
      }
    } else if (obj.channel === 'yipay') {
      return {
        ...data,
        params: JSON.stringify({
          pid: obj?.pid,
          key: obj?.key,
          api: obj?.api,
          return_url: obj?.return_url
        })
      }
    } else {
      return false
    }
  }

  return (
    <div>
      <ProTable
        actionRef={tableActionRef}
        columns={columns}
        scroll={{
          x: 1400
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getAdminPayment({
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
              新增支付渠道
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />

      <ModalForm<MIXInfo>
        title="支付渠道"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          channel: 'alipay'
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
          const data = changeUpdateData(values)
          if (!data) return false

          if (edidInfoModal.info?.id) {
            const res = await putAdminPayment({
              ...data,
              id: edidInfoModal.info?.id
            } as PaymentInfo)
            if (res.code) {
              message.error('编辑失败')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await addAdminPayment(data as PaymentInfo)
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
        <ProFormText
          name="name"
          label="渠道名称"
          rules={[{ required: true, message: '请输入渠道名称' }]}
        />
        <ProFormGroup>
          <ProFormCheckbox.Group
            name="types"
            label="可用通道"
            options={[
              {
                label: '支付宝',
                value: 'alipay'
              },
              {
                label: '微信',
                value: 'wxpay'
              },
              {
                label: 'QQ',
                value: 'qqpay'
              }
            ]}
            rules={[{ required: true, message: '请选择可用通道' }]}
            tooltip="用于微信支付和支付支付的选择"
          />
          <ProFormSegmented
            name="status"
            label="状态"
            request={async () => [
              {
                label: '上线',
                value: 1
              },
              {
                label: '下线',
                value: 0
              }
            ]}
            rules={[{ required: true, message: '请选择状态' }]}
          />
          <ProFormSegmented
            name="channel"
            label="支付官方"
            request={async () => [
              {
                label: '支付宝-当面付',
                value: 'alipay'
              },
              {
                label: '易支付',
                value: 'yipay'
              }
            ]}
            rules={[{ required: true, message: '请选择状态' }]}
          />
        </ProFormGroup>
        <ProFormDependency name={['channel']}>
          {({ channel }) => {
            return <BetaSchemaForm layoutType="Embed" columns={payKeyColumns[channel]} />
          }}
        </ProFormDependency>
      </ModalForm>
    </div>
  )
}

export default PaymentPage
