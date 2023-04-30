import { CommentOutlined, DeleteOutlined } from '@ant-design/icons'

import styles from './index.module.less'
import { joinTrim } from '@/utils'

type Props = {
  mode?: 'vertical' | 'horizontal' | 'inline'
}

function MenuList(props: Props) {

  const { mode = 'horizontal' } = props;

  const item = (p:{ hideMessage?: boolean }) => {
    return (
      <div className={styles.item}>
        <span className={styles.item_icon}>
          <CommentOutlined />
        </span>
        <div className={styles.item_text}>
          <p className={styles.item_title}>标题</p>
          {p.hideMessage && <span className={styles.item_message}>我是一段描述内容</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={joinTrim([
      styles.menuList,
      styles['menuList_' + mode]
    ])}
    >
      {item({
        hideMessage: mode !== 'horizontal'
      })}
      {item({
        hideMessage: mode !== 'horizontal'
      })}
      {item({
        hideMessage: mode !== 'horizontal'
      })}
      {item({
        hideMessage: mode !== 'horizontal'
      })}
    </div>
  )
}

export default MenuList
