import { ProductInfo } from '@/types'
import styles from './index.module.less'
import { useEffect, useState } from 'react'

function GoodsList(props: { list: Array<ProductInfo>; onChange: (item: ProductInfo) => void }) {
  const [selectItem, setSelectItem] = useState<ProductInfo>()

  useEffect(() => {
    if (selectItem && selectItem.id) {
      props.onChange?.(selectItem)
    }
  }, [selectItem])

  return (
    <div className={styles.goodsList}>
      {props.list.map((item) => {
        const className =
          selectItem?.id === item.id
            ? `${styles.goodsList_item} ${styles.goodsList_item_select}`
            : styles.goodsList_item
        return (
          <div
            key={item.id}
            className={className}
            onClick={() => {
              setSelectItem(item)
            }}
          >
            {item.integral ? <h3>{item.integral}积分</h3> : <h3>会员{item.day}天</h3>}
            <div className={styles.goodsList_item_button}>
              <p>
                {(item.price / 100).toFixed(2)}
                <span>元</span>
              </p>
            </div>
            <span className={styles.goodsList_item_tag}>{item.badge}</span>
          </div>
        )
      })}
    </div>
  )
}

export default GoodsList
