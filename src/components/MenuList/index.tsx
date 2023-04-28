import { CommentOutlined, DeleteOutlined } from '@ant-design/icons'

import styles from './index.module.less'

function MenuList() {
  const item = () => {
    return (
      <div className={styles.item}>
        <CommentOutlined />
        <span className={styles.item_title}>标题</span>
      </div>
    )
  }
  return (
    <div className={styles.menuList}>
      {item()}
      {item()}
      {item()}
    </div>
  )
}

export default MenuList
