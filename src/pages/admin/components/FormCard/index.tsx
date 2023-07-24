import styles from './index.module.less'

type Props = {
  title?: string
  children?: React.ReactNode
  type?: string
}

function FormCard(props: Props) {

  if (props.type === 'avatar') {
    return (
      <div className={styles.proFormCard}>
        <div className={styles.proFormCard_label}>
          <label>{props?.title}</label>
        </div>
        <div className={styles.proFormCard_card}>{props?.children}</div>
      </div>
    )
  }

  return (
    <div className={styles.proFormCard}>
      <div className={styles.proFormCard_label}>
        <label>{props?.title}</label>
      </div>
      {props?.children}
    </div>
  )
}

export default FormCard
