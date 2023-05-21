import { UserInfo } from '@/types'
import styles from './index.module.less'
import { Space, Statistic } from 'antd'
import { useMemo } from 'react'

function UserInfoCard(props: { info?: UserInfo }) {
  const subscribe = useMemo(() => {
    if (!props.info?.subscribe) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTime = today.getTime()
    const subscribeTime = new Date(props.info?.subscribe || 0).getTime()
    if (subscribeTime < todayTime) return 0
    const time = Math.ceil((subscribeTime - todayTime) / 86400000)
    return time
  }, [props])

  const info = useMemo(() => {
    return props.info
  }, [props])

  return (
    <div className={styles.userInfo}>
      <img className={styles.userInfo_avatar} src={info?.avatar} alt="" />
      <div className={styles.userInfo_info}>
        <p>{info?.nickname}</p>
        <span>{info?.account}</span>
      </div>
      <div className={styles.userInfo_vip}>
        <Space wrap size="large">
          <Statistic title="积分" value={info?.integral} />
          <Statistic title="会员(天)" value={subscribe} />
        </Space>
      </div>
    </div>
  )
}

export default UserInfoCard
