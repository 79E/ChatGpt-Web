import {
    delAdminDrawRecord,
    putAdminDrawRecord,
    getAdminDrawRecords
} from '@/request/adminApi'
import { DrawRecordInfo } from '@/types/admin'
import {
    ActionType,
    ModalForm,
    ProColumns,
    ProFormGroup,
    ProFormRadio,
    ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Tag, Button, message, Form, Popconfirm, Image } from 'antd'
import { useRef, useState } from 'react'

function DrawRecordPage() {
    const tableActionRef = useRef<ActionType>()
    const [form] = Form.useForm<DrawRecordInfo>()
    const [edidInfoModal, setEditInfoModal] = useState<{
        open: boolean
        info: DrawRecordInfo | undefined
    }>({
        open: false,
        info: undefined
    })

    const columns: ProColumns<DrawRecordInfo>[] = [
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
                if (data.status === 4) {
                    return <Tag color="orange">私有绘画</Tag>
                }
                if (data.status) {
                    return <Tag color="green">公开绘画</Tag>
                }
                return <Tag color="red">异常状态</Tag>
            }
        },
        {
            title: '绘画图',
            dataIndex: 'images',
            width: 140,
            render: (_, data) => {
                return <Image src={data.images?.[0]} width={100} />
            }
        },
        {
            title: '提示词',
            dataIndex: 'prompt'
        },
        {
            title: '创建用户',
            dataIndex: 'user',
            render: (_, data) => {
                return <Tag>{data.user?.account}</Tag>
            }
        },
        {
            title: '垫图',
            dataIndex: 'inset_image_url',
            width: 140,
            render: (_, data) => {
                if (!data.inset_image_url) return <Tag>无垫图</Tag>
                return <Image src={data.inset_image_url} width={100} />
            }
        },
        {
            title: '消耗时长',
            dataIndex: 'take_time',
            render: (_, data) => <Tag>{data.take_time}秒</Tag>
        },
        {
            title: '图片大小',
            dataIndex: 'size',
            render: (_, data) => <Tag>{data.size}</Tag>
        },
        {
            title: '绘画模型',
            dataIndex: 'model',
            render: (_, data) => <Tag>{data.model}</Tag>
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
                            delAdminDrawRecord({
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
                    const res = await getAdminDrawRecords({
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
                        
                    ]
                }}
                rowKey="id"
                search={false}
                bordered
            />

            <ModalForm<DrawRecordInfo>
                title="绘画信息"
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
                    const res = await putAdminDrawRecord({
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
                                label: '异常状态（用户端删除）',
                                value: 0
                            },
                            {
                                label: '公开绘画',
                                value: 1
                            },
                            {
                                label: '私有绘画',
                                value: 4
                            }
                        ]}
                        rules={[{ required: true, message: '请选择状态' }]}
                    />
                </ProFormGroup>
            </ModalForm>
        </div>
    )
}

export default DrawRecordPage
