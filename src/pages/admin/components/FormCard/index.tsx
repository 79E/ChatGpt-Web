import styles from './index.module.less';

type Props = {
	title?: string,
	children?: React.ReactNode
}

function FormCard(props: Props) {
  return (
    <div className={styles.formCard}>
      <p className={styles.formCard_title}>{props?.title}</p>
	  {props?.children}
    </div>
  )
}


export default FormCard;
