import useDocumentResize from '@/hooks/useDocumentResize'
import styles from './index.module.less'
import { useMemo } from 'react'

type Props = {
  title: string
  describe?: string
  direction?: 'vertical' | 'horizontal'
  children?: React.ReactNode
}

function FormItemCard(props: Props) {

  const { direction = 'horizontal' } = props;

  const { width } = useDocumentResize()

  const style: React.CSSProperties = useMemo(()=>{
    if(direction === 'vertical'){
      return {
        flexDirection: 'column',
        alignItems: 'normal'
      }
    }
    return {
      flexDirection: width < 600 ? 'column' : 'row',
      alignItems: width < 600 ? 'normal' : 'center'
    }
  }, [direction, width])

  return (
    <div
      className={styles.formItemCard}
      style={style}
    >
      <div className={styles.formItemCard_text}>
        <p>{props.title}</p>
        {props.describe && <span>{props.describe}</span>}
      </div>
      <div className={styles.formItemCard_field}>{props.children}</div>
    </div>
  )
}

export default FormItemCard
