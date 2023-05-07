import styles from './index.module.less';
function GoodsList() {
    return (
        <div className={styles.goodsList}>
            <div className={styles.goodsList_item}>
                <h3>1000分</h3>
                <p>12元</p>
                <div className={styles.goodsList_item_button}>立即充值</div>
                <span className={styles.goodsList_item_tag}>特惠</span>
            </div>
            <div className={styles.goodsList_item}>
                <h3>10000分</h3>
                <p>12元</p>
                <div className={styles.goodsList_item_button}>立即充值</div>
                <span className={styles.goodsList_item_tag}>特惠</span>
            </div>
        </div>
    )
}

export default GoodsList;