import {
  delAdminNotification,
  getAdminConfig,
  getAdminNotification,
  postAdminNotification,
  putAdminConfig,
  putAdminNotification
} from '@/request/adminApi'
import { ConfigInfo, NotificationInfo } from '@/types/admin'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Input, InputNumber, Modal, Radio, Space, Tag, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import FormCard from '../components/FormCard'
import RichEdit from '@/components/RichEdit'

function NotificationPage() {
  const [configs, setConfigs] = useState<Array<ConfigInfo>>([])
  const tableActionRef = useRef<ActionType>()

  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: NotificationInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const [edidContentModal, setEdidContentModal] = useState<{
    title?: string
    open: boolean
    key: string
    content: string
  }>({
    title: '',
    open: false,
    key: '',
    content: ''
  })


  const columns: ProColumns<NotificationInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: '标题',
      width: 180,
      dataIndex: 'title'
    },
    {
      title: '排序',
      width: 180,
      dataIndex: 'sort',
      tooltip: '数字越大越往后排'
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '状态值',
      dataIndex: 'status',
      width: 100,
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? '上线' : '下线'}</Tag>
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
            delAdminNotification({
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
          const res = await getAdminNotification({
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
                      title: '',
                      content: '',
                      status: 1,
                      sort: 1
                    } as any
                  }
                })
              }}
            >
              新增通知
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />

      <Modal
        title="通知信息"
        destroyOnClose
        width={600}
        open={edidInfoModal.open}
        onOk={() => {
          const { id, title, content, status, sort } = edidInfoModal.info || {}
          if (!edidInfoModal.info || !title || !content) {
            message.warning('请添加标题和内容')
            return
          }
          if (id) {
            // 编辑
            putAdminNotification(edidInfoModal.info).then((res) => {
              if (res.code) return
              setEditInfoModal(() => {
                return {
                  open: false,
                  info: {
                    title: '',
                    content: '',
                    status: 1,
                    sort: 1
                  } as any
                }
              })
              tableActionRef.current?.reload()
            })
          } else {
            postAdminNotification({
              title,
              content,
              status,
              sort
            } as any).then((res) => {
              if (res.code) return
              setEditInfoModal(() => {
                return {
                  open: false,
                  info: {
                    title: '',
                    content: '',
                    status: 1,
                    sort: 1
                  } as any
                }
              })
              tableActionRef.current?.reload()
            })
          }
        }}
        onCancel={() => {
          setEditInfoModal({ open: false, info: undefined })
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <FormCard title="标题">
              <Input
                value={edidInfoModal.info?.title}
                placeholder="通知标题"
                onChange={(e) => {
                  setEditInfoModal((editInfo) => {
                    const info = { ...editInfo.info, title: e.target.value }
                    return {
                      ...editInfo,
                      info
                    } as any
                  })
                }}
              />
            </FormCard>
            <FormCard title="排序">
              <InputNumber
                min={1}
                max={999999}
                defaultValue={edidInfoModal.info?.sort}
                value={edidInfoModal.info?.sort}
                placeholder="排序"
                onChange={(value) => {
                  setEditInfoModal((editInfo) => {
                    const info = { ...editInfo.info, sort: value }
                    return {
                      ...editInfo,
                      info
                    } as any
                  })
                }}
              />
            </FormCard>
            <FormCard title="状态">
              <Radio.Group
                onChange={(e) => {
                  setEditInfoModal((editInfo) => {
                    const info = { ...editInfo.info, status: e.target.value }
                    return {
                      ...editInfo,
                      info
                    } as any
                  })
                }}
                defaultValue={edidInfoModal.info?.status}
                value={edidInfoModal.info?.status}
              >
                <Radio.Button value={1}>上线</Radio.Button>
                <Radio.Button value={0}>下线</Radio.Button>
              </Radio.Group>
            </FormCard>
          </Space>
          <FormCard title="通知内容">
            <RichEdit
              value={edidInfoModal.info?.content}
              onChange={(value) => {
                setEditInfoModal((editInfo) => {
                  const info = { ...editInfo.info, content: value }
                  return {
                    ...editInfo,
                    info
                  } as any
                })
              }}
            />
          </FormCard>
        </Space>
      </Modal>
    </div>
  )
}

export default NotificationPage
