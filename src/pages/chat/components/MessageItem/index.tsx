import { CommentOutlined, DeleteOutlined, RedditCircleFilled } from '@ant-design/icons';
import styles from './index.module.less';
import { useMemo } from 'react';
import { Popconfirm } from 'antd';

type Props = {
    isPersona: boolean,
    isSelect: boolean,
    name?: string,
    onConfirm?: () => void
    onCancel?: () => void
}

function MessageItem(props: Props) {
    const className = useMemo(() => {
        const value = props.isSelect ?
            `${styles.menuItem} ${styles.menuItem_action}`
            : styles.menuItem
        return value
    }, [props.isSelect])
    return (
        <div className={className}>
            <span className={styles.menuItem_icon}>
                {props.isPersona ? <RedditCircleFilled /> : <CommentOutlined />}
            </span>
            <span className={styles.menuItem_name}>{props?.name}</span>
            <div className={styles.menuItem_options}>
                <Popconfirm
                    title="删除会话"
                    description="是否确定删除会话？"
                    onConfirm={props.onConfirm}
                    onCancel={props.onCancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined />
                </Popconfirm>
            </div>
        </div>
    )
}

export default MessageItem;