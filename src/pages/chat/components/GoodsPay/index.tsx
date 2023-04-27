import { Drawer } from 'antd'
import styles from './index.module.less'

type Props = {
  open: boolean
  onClose?: () => void
}

function GoodsPay(props: Props) {
  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={props.onClose}
      forceRender
      open={props.open}
      width="100vw"
      height="100vh"
      mask={false}
      bodyStyle={{
        paddingBottom: 0
      }}
    >
      <div className={styles.goodsPay}>
        <span>2</span>
      </div>
    </Drawer>
  )
}

export default GoodsPay
