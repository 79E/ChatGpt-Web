import { ProductInfo } from '@/types'
import styles from './index.module.less'

function GoodsList(props: { list: Array<ProductInfo>; onClick: (item: ProductInfo) => void }) {
  return (
    <div className={styles.goodsList}>
      {props.list.map((item) => {
        return (
          <div
            key={item.id}
            className={styles.goodsList_item}
            onClick={() => {
              props.onClick?.(item)
            }}
          >
            {item.integral ? <h3>{item.integral}分</h3> : <h3>{item.day}天</h3>}
            <p>{item.price / 100}元</p>
            <div className={styles.goodsList_item_button}>立即充值</div>
            <span className={styles.goodsList_item_tag}>{item.badge}</span>
          </div>
        )
      })}
    </div>
  )
}

export default GoodsList
