import menuList from '@/routers/menu_list'
import styles from './index.module.less'
import { joinTrim } from '@/utils'
import { Link, useLocation } from 'react-router-dom'
import { useMemo } from 'react'

type Props = {
  mode?: 'vertical' | 'horizontal' | 'inline'
}

function MenuList(props: Props) {
  const location = useLocation()

  const pathname = useMemo(() => {
    return location.pathname
  }, [location])

  const { mode = 'horizontal' } = props

  return (
    <div className={joinTrim([styles.menuList, styles['menuList_' + mode]])}>
      {menuList.web.map((item) => {
        const isExternal = /^(http:\/\/|https:\/\/)/.test(item.path)
        return (
          <Link key={item.path} to={item.path} target={isExternal ? '_blank' : '_self'}>
            <div
              className={joinTrim([styles.item, pathname === item.path ? styles.select_item : ''])}
            >
              <span className={styles.item_icon}>{item.icon}</span>
              <div className={styles.item_text}>
                <p className={styles.item_title}>{item.name}</p>
                {mode !== 'horizontal' && (
                  <span className={styles.item_message}>{item.message}</span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default MenuList
