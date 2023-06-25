import {
  getAdminProducts,
  delAdminProduct,
  postAdminProduct,
  putAdminProduct
} from '@/request/adminApi'
import { ProductInfo } from '@/types/admin'
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Form, Tag, Tooltip, message } from 'antd'
import { useRef, useState } from 'react'

function ProductPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<ProductInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: ProductInfo | undefined
  }>({
    open: false,
    info: undefined
  })
  const columns: ProColumns<ProductInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (_, data) => {
        return <a>{data.price}分</a>
      }
    },
    {
      title: '原价',
      dataIndex: 'original_price',
      render: (_, data) => {
        return <a>{data.original_price}分</a>
      }
    },
    {
      title: '积分/天数',
      dataIndex: 'value',
      render: (_, data) => {
        return <a>{data.type === 'integral' ? data.value + '积分' : data.value + '天'}</a>
      }
    },
    {
      title: '级别',
      dataIndex: 'level',
      render: (_, data) => {
        if (data.level === 1) {
          return <Tag color="#f50">普通会员</Tag>
        }
        if (data.level === 2) {
          return <Tag color="#ce9e4f">超级会员</Tag>
        }
        return <Tag>暂无级别</Tag>
      }
    },
    {
      title: '商品描述',
      dataIndex: 'describe',
      ellipsis: {
        showTitle: false
      },
      render: (_, data) => <Tooltip title={data.describe}>{data.describe}</Tooltip>
    },
    {
      title: '状态值',
      dataIndex: 'status',
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? '上架' : '下架'}</Tag>
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      tooltip: '数字越大越往后排'
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
            delAdminProduct({
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
          x: 1200
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const res = await getAdminProducts({
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
              新增商品
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />
      <ModalForm<ProductInfo>
        title="商品信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          level: 1,
          sort: 1
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
          if (edidInfoModal.info?.id) {
            console.log('进入编辑')
            const res = await putAdminProduct({
              ...data,
              id: edidInfoModal.info?.id
            })
            if (res.code) {
              message.error('编辑失败')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await postAdminProduct(data)
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
            width="md"
            name="title"
            label="标题"
            placeholder="标题"
            rules={[{ required: true, message: '请输入商品标题' }]}
          />
          <ProFormText
            width="xs"
            name="badge"
            label="角标"
            placeholder="角标"
            rules={[{ required: true, message: '请输入角标' }]}
          />
          <ProFormDigit
            width="xs"
            name="sort"
            label="排序"
			tooltip="数字越大越往后排"
            min={1}
            max={999999}
            placeholder="排序"
            rules={[{ required: true }]}
          />
        </ProFormGroup>
        <ProFormText name="describe" label="描述" placeholder="商品描述" />
        <ProFormGroup>
          <ProFormDigit
            label="价格(分)"
            name="price"
            min={1}
            max={1000000}
            rules={[{ required: true, message: '请输入商品价格,单位为分' }]}
          />
          <ProFormDigit label="原价(分)" name="original_price" min={0} max={1000000} />
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
        </ProFormGroup>
        <ProFormGroup>
          <ProFormRadio.Group
            name="type"
            label="奖励类型"
            radioType="button"
            options={[
              {
                label: '积分',
                value: 'integral'
              },
              {
                label: '天数',
                value: 'day'
              }
            ]}
            rules={[{ required: true }]}
          />
          <ProFormDigit
            width="sm"
            label="积分/天数"
            name="value"
            min={0}
            max={1000000}
            rules={[{ required: true }]}
          />
          <ProFormRadio.Group
            name="level"
            label="商品级别"
            radioType="button"
            options={[
              {
                label: '普通会员',
                value: 1
              },
              {
                label: '超级会员',
                value: 2
              }
            ]}
          />
        </ProFormGroup>
      </ModalForm>
    </div>
  )
}

export default ProductPage
