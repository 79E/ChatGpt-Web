import React, { useMemo } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/es/components/Header'
import styles from './index.module.less'
import { CloudSyncOutlined, LogoutOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import useStore from '@/store'
import { Button, Dropdown } from 'antd'

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  console.log(props)

  const { token, user_detail, setLoginModal } = useStore()

  const renderLogo = useMemo(() => {
    if (typeof props.logo === 'string')
      return <img className={styles.header__logo} src={props.logo} />
    return <>{props.logo}</>
  }, [props.logo])

  return (
    <div className={styles.header}>
      {props.isMobile && (
        <MenuUnfoldOutlined
          className={styles.header__menuIcon}
          onClick={() => props.onCollapse?.(!props.collapsed)}
        />
      )}
      <div className={styles.header__logo}>
        {renderLogo}
        {!props.isMobile && <h1>{props.title}</h1>}
      </div>
      <div>列表</div>
      <div className={styles.header__actives}>
        {token ? (
          <Dropdown
            menu={{
              items: [
                // {
                //   key:'info',
                //   icon: <CloudSyncOutlined />,
                //   label: '用户信息',
                //   onClick: ()=>{

                //   }
                // },
                // {
                //   key:'yue',
                //   icon: <CloudSyncOutlined />,
                //   label: '我的余额',
                //   onClick: ()=>{

                //   }
                // },
                {
                  key: 'zhifuzhongxin',
                  icon: <CloudSyncOutlined />,
                  label: '支付中心',
                  onClick: () => {
                    // setGoodsPayOptions({ open: true })
                  }
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: () => {
                    // logout()
                  }
                }
              ]
            }}
          >
            <img src={user_detail?.avatar} alt="" />
          </Dropdown>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setLoginModal(true)
            }}
          >
            登录 / 注册
          </Button>
        )}
      </div>
    </div>
  )
}

export default HeaderRender
