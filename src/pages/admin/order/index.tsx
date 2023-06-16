import { getAdminOrders } from '@/request/adminApi';
import { OrderInfo } from '@/types/admin';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import styles from './index.module.less';

function OrderPage() {

    const tableActionRef = useRef<ActionType>();
    const [isModalOpen, setIsModalOpen] = useState({
        open: false,
        title: '',
        json: ''
    });

    const columns: ProColumns<OrderInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
            fixed: 'left'
        },
        {
            title: '支付方ID',
            dataIndex: 'trade_no',
            render: (_, data) => (
                <a onClick={() => {
                    if (data.notify_info && data.trade_no) {
                        setIsModalOpen({
                            title: '支付方通知参数',
                            json: data.notify_info,
                            open: true
                        })
                    }
                }
                }

                >{data.trade_no ? data.trade_no : '未支付'}
                </a>
            )
        },
        {
            title: '商品标题',
            dataIndex: 'product_title',
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: '商品信息',
                        json: data.product_info,
                        open: true
                    })
                }}
                >{data.product_title}
                </a>
            )
        },
        {
            title: '支付类型',
            dataIndex: 'pay_type',
            width: 120,
            render: (_, data) => {
                const type: { [key: string]: { [key: string]: string } } = {
                    alipay: {
                        color: 'blue',
                        text: '支付宝'
                    },
                    wxpay: {
                        color: 'green',
                        text: '微信'
                    },
					qqpay: {
                        color: 'geekblue',
                        text: 'QQ支付'
                    }
                }
                return <Tag color={type[data.pay_type].color}>{type[data.pay_type].text}</Tag>
            }
        },
        {
            title: '支付金额',
            dataIndex: 'money',
            width: 120,
            render: (_, data) => <Tag color="blue">{data.money}元</Tag>
        },
        {
            title: '订单状态',
            dataIndex: 'trade_status',
            width: 180,
            render: (_, data) => {
                const status:{ [key: string]: { [key: string]: string } } = {
                    WAIT_BUYER_PAY: {
                        color: 'orange',
                        text: '等待支付'
                    },
                    TRADE_SUCCESS: {
                        color: 'green',
                        text: '支付成功'
                    },
                    TRADE_CLOSED: {
                        color: 'red',
                        text: '订单关闭'
                    },
                    TRADE_FINISHED: {
                        color: 'purple',
                        text: '订单完毕'
                    }
                }
                const color = status[data.trade_status].color || 'red'
                const text = status[data.trade_status].text || data.trade_status || '数据异常'
                return <Tag color={color}>{text}</Tag>
            }
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
            title: '支付渠道',
            dataIndex: 'channel',
            width: 120,
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: '支付渠道信息',
                        json: data.payment_info,
                        open: true
                    })
                }}
                >{data.channel}
                </a>

            )
        },
        {
            title: '支付链接',
            dataIndex: 'pay_url',
            ellipsis: true,
            render: (_, data) => <a href={data?.pay_url || ''} target="_blank" rel="noreferrer">{data.pay_url}</a>
        },
        {
            title: '额外参数',
            dataIndex: 'params',
            width: 100,
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: '额外参数',
                        json: data.params,
                        open: true
                    })
                }}
                >
                    点击查看
                </a>
            )
        },
        {
            title: 'IP',
            dataIndex: 'ip',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
        },
        // {
        //     title: '操作',
        //     width: 160,
        //     valueType: 'option',
        //     fixed: 'right',
        //     render: (_, data) => [
        //         <Button
        //             key="edit"
        //             type="link"
        //             onClick={() => {
        //                 setEditInfoModal(() => {
        //                     form?.setFieldsValue({
        //                         ...data
        //                     });
        //                     return {
        //                         open: true,
        //                         info: data
        //                     }
        //                 });
        //             }}
        //         >
        //             编辑
        //         </Button>,
        //         <Button
        //             key="del"
        //             type="text"
        //             danger
        //             onClick={() => {
        //                 delAdminProduct({
        //                     id: data.id
        //                 }).then((res) => {
        //                     if (res.code) return
        //                     message.success('删除成功')
        //                     tableActionRef.current?.reload()
        //                 })
        //             }}
        //         >
        //             删除
        //         </Button>
        //     ]
        // }
    ];

    function syntaxHighlight(json: string) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                scroll={{
                    x: 2000
                }}
                request={async (params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    const res = await getAdminOrders({
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
                    actions: []
                }}
                rowKey="id"
                search={false}
                bordered
            />

            <Modal
                title={isModalOpen.title}
                open={isModalOpen.open}
                onOk={() => {
                    setIsModalOpen(() => {
                        return {
                            title: '',
                            open: false,
                            json: ''
                        }
                    })
                }}
                onCancel={() => {
                    setIsModalOpen(() => {
                        return {
                            title: '',
                            open: false,
                            json: ''
                        }
                    })
                }}
            >
                {
                    isModalOpen.json && (
                        <pre className={styles.jsonPre} dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(JSON.stringify(JSON.parse(isModalOpen.json), null, 4))
                        }}
                        />
                    )
                }
            </Modal>
        </div>
    )
}

export default OrderPage;
