import { Badge } from 'antd'
import styles from './index.module.less'
import { UserInfo } from '@/types'
import { getEmailPre } from '@/utils'
import React from 'react'

type Props = {
  id: string | number
  avatar: string
  title: string
  message?: string
  description?: string
  status?: number
  userInfo?: UserInfo
  buttons: Array<React.ReactNode>
}

function AppCard(props: Props) {
  return (
    <div className={styles.appCard} key={props.id}>
      <div className={styles.appCard_header}>
        <Badge
          dot
          color={props.status === 1 ? 'transparent' : props.status === 4 ? 'orange' : 'red'}
        >
          <div className={styles.appCard_icon}>
            {props.avatar && <img src={props.avatar} alt="" />}
          </div>
        </Badge>
        <div className={styles.appCard_text}>
          <p>{props.title}</p>
          <span>{props.message}</span>
        </div>
      </div>
      <p className={styles.appCard_description}>{props.description}</p>
      <div className={styles.appCard_footer}>
        <div className={styles.appCard_footer_userInfo}>
          {props.userInfo?.avatar && <img src={props.userInfo?.avatar} alt="" />}
          <span>{getEmailPre(props.userInfo?.account)}</span>
        </div>
        <div className={styles.appCard_button}>{props.buttons.map((dom) => dom)}</div>
      </div>
    </div>
  )
}

export default AppCard
