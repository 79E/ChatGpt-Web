import React, { useMemo } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/es/components/Header'
import styles from './index.module.less'
import { AppstoreOutlined, CloudSyncOutlined, LogoutOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import useStore from '@/store'
import { Avatar, Button, Dropdown } from 'antd'
import { getEmailPre } from '@/utils'
import MenuList from '../MenuList'

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  console.log(props)

  const { token, user_detail, logout, setLoginModal } = useStore()

  const renderLogo = useMemo(() => {
    if (typeof props.logo === 'string')
      return <img className={styles.header__logo} src={props.logo} />
    return <>{props.logo}</>
  }, [props.logo])

  return (
    <div className={styles.header}>
      {(props.isMobile && props.hasSiderMenu) && (
        <MenuUnfoldOutlined
          className={styles.header__menuIcon}
          onClick={() => props.onCollapse?.(!props.collapsed)}
        />
      )}
      <div className={styles.header__logo}>
        {renderLogo}
        {!props.isMobile && <h1>{props.title}</h1>}
      </div>
      {!props.isMobile && <MenuList />}
      <div className={styles.header__actives}>
        {token ? (
          <Dropdown
            arrow
            placement="bottomRight"
            trigger={['click']}
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
                    logout()
                  }
                }
              ]
            }}
          >
            <div>
              <Avatar src={user_detail?.avatar} />
              {!props.isMobile && (
                <span
                  style={{
                    fontSize: 14,
                    color: '#999',
                    marginLeft: 4
                  }}
                >
                  {getEmailPre(user_detail?.account)}
                </span>
              )}
            </div>
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
        {
          props.isMobile && (
            <Dropdown
              arrow
              placement="bottomRight"
              destroyPopupOnHide
              trigger={['click']}
              dropdownRender={() => {
                return <MenuList mode="inline" />
              }}
            >
              <div className={styles.header__actives_menu}>
                <AppstoreOutlined />
              </div>
            </Dropdown>
          )
        }
      </div>
    </div>
  )
}

export default HeaderRender
