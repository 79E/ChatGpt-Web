import { delAdminTurnover, getAdminTurnovers, putAdminTurnover } from '@/request/adminApi';
import { TurnoverInfo } from '@/types/admin';
import { ActionType, ModalForm, ProColumns, ProFormGroup, ProFormText } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useRef, useState } from 'react';

function TurnoverPage() {

    const tableActionRef = useRef<ActionType>();
    const [form] = Form.useForm<TurnoverInfo>();
    const [edidInfoModal, setEditInfoModal] = useState<{
        open: boolean,
        info: TurnoverInfo | undefined
    }>({
        open: false,
        info: undefined
    });

    const columns: ProColumns<TurnoverInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: '用户账号',
            width: 180,
            dataIndex: 'user_id',
            render: (_, data) => {
                if (!data.user_id) return '-'
                return (
                    <p>{data.user?.account}</p>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'describe',
        },
        {
            title: '值',
            dataIndex: 'value',
            render: (_, data) => <a>{data.value}</a>
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
        },
        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
            width: 160,
            render: (_, data) => [
                <Button key="edit" type="link" onClick={() => {
                    setEditInfoModal({
                        open: true,
                        info: data
                    })
                    form.setFieldsValue({
                        ...data
                    })
                }}
                >
                    编辑
                </Button>,
                <Button key="del" type="text" danger onClick={() => {
                    delAdminTurnover({
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
            ],
        },
    ];

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
                    const res = await getAdminTurnovers({
                        page: params.current || 1,
                        page_size: params.pageSize || 10,
                    });
                    return Promise.resolve({
                        data: res.data.rows,
                        total: res.data.count,
                        success: true,
                    });
                }}
                toolbar={{
                    actions: [],
                }}
                rowKey="id"
                search={false}
                bordered
            />

            <ModalForm<TurnoverInfo>
                title="用户消费记录"
                open={edidInfoModal.open}
                form={form}
                initialValues={{
                    status: 1
                }}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                    }
                    setEditInfoModal((info) => {
                        return {
                            ...info,
                            open: visible
                        }
                    })
                }}
                onFinish={async (values) => {
                    const res = await putAdminTurnover({
                        ...edidInfoModal.info,
                        ...values,
                    });
                    if (res.code) {
                        message.error('编辑失败')
                        return false;
                    }
                    tableActionRef.current?.reload?.();
                    return true;
                }}
                size="large"
                modalProps={{
                    cancelText: '取消',
                    okText: '提交'
                }}
            >
                <ProFormText
                    width="lg"
                    name="user_id"
                    label="用户ID"
                    placeholder="用户ID"
                    disabled
                />
                <ProFormGroup>
                    <ProFormText
                        width="lg"
                        name="describe"
                        label="描述"
                        placeholder="操作描述"
                        rules={[{ required: true, message: '请输入操作描述！' }]}
                    />
                    <ProFormText
                        name="value"
                        label="值"
                        placeholder="操作对应值！"
                        rules={[{ required: true, message: '请输入操作相应的值！' }]}
                    />
                </ProFormGroup>

            </ModalForm>
        </div>
    )
}

export default TurnoverPage;