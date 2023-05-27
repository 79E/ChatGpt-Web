import { getAdminMessages } from '@/request/adminApi';
import { MessageInfo } from '@/types/admin';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import { useRef} from 'react';

function MessagePage() {

    const tableActionRef = useRef<ActionType>();
    const columns: ProColumns<MessageInfo>[] = [
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
            title: '内容',
            dataIndex: 'content',
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: 130,
            render: (_, data)=><Tag color={data.role.includes('user') ? 'cyan' : 'green'}>{data.role}</Tag>
        },
        {
            title: '模型',
            dataIndex: 'model',
            width: 180,
            render: (_, data)=><Tag color={data.model.includes('gpt-4') ? 'purple' : ''}>{data.model}</Tag>
        },
        {
            title: '会话ID',
            dataIndex: 'parent_message_id',
            render: (_, data)=><Tag>{data.parent_message_id}</Tag>
        },
        {
            title: '状态值',
            dataIndex: 'status',
            width: 100,
            render: (_, data) => <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '异常'}</Tag>
        },
        {
            title: '创建时间',
            width: 200,
            dataIndex: 'create_time',
        },
        {
            title: '更新时间',
            width: 200,
            dataIndex: 'update_time',
        },
    ];

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                scroll={{
                    x: 1800
                }}
                request={async (params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    const res = await getAdminMessages({
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
        </div>
    )
}

export default MessagePage;