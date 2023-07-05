import React, { useEffect, useMemo, useState } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/es/components/Header'
import styles from './index.module.less'
import {
  AppstoreOutlined,
  CloudSyncOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  PayCircleOutlined,
  ReconciliationOutlined,
  SyncOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons'
import { chatStore, userStore } from '@/store'
import { Avatar, Button, Dropdown } from 'antd'
import { getEmailPre } from '@/utils'
import MenuList from '../MenuList'
import { useNavigate } from 'react-router-dom'
import { fetchUserInfo } from '@/store/user/async'

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  const navigate = useNavigate()

  const { token, user_info, logout, setLoginModal } = userStore()
  const { clearChats } = chatStore()

  const renderLogo = useMemo(() => {
    if (typeof props.logo === 'string') return <img src={props.logo} />
    return <>{props.logo}</>
  }, [props.logo])

  useEffect(() => {
    onRefreshBalance()
  }, [token])

  const [balance, setBalance] = useState<{
    number: string | number
    loading: boolean
  }>({
    number: 0,
    loading: false
  })

  function onRefreshBalance() {
    setBalance((b) => ({ ...b, loading: true }))
    if (token) {
      // 获取用户信息
      fetchUserInfo()
        .then((res) => {
          if (res.code) return
          setBalance((b) => ({ ...b, number: res.data.integral, loading: false }))
        })
        .finally(() => {
          setBalance((b) => ({ ...b, loading: false }))
        })
    } else {
      setBalance((b) => ({ ...b, loading: false }))
    }
  }

  return (
    <div className={styles.header}>
      {props.isMobile && props.hasSiderMenu && (
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Dropdown
              arrow
              placement="bottomRight"
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'yonghuzhongxin',
                    icon: <UserOutlined />,
                    label: '用户中心',
                    onClick: () => {
                      navigate('/user')
                    }
                  },
                  {
                    key: 'wodeyue',
                    icon: <PayCircleOutlined />,
                    label: '我的余额',
                    onClick: () => {
                      navigate('/shop')
                    }
                  },
                  {
                    key: 'xiaofeijilu',
                    icon: <ReconciliationOutlined />,
                    label: '消费记录',
                    onClick: () => {
                      navigate('/shop')
                    }
                  },
                  {
                    key: 'tuichudenglu',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: () => {
                      logout()
					  clearChats()
                      navigate('/login')
                    }
                  }
                ]
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Avatar src={user_info?.avatar} />
                {!props.isMobile && (
                  <span
                    style={{
                      fontSize: 14,
                      color: '#999',
                      marginLeft: 4
                    }}
                  >
                    {getEmailPre(user_info?.account)}
                  </span>
                )}
              </div>
            </Dropdown>
            <div
              className={styles.header__balance}
              onClick={() => {
                onRefreshBalance()
              }}
            >
              <p>余额：{balance.number}</p> <SyncOutlined spin={balance.loading} />
            </div>
          </div>
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
        {props.isMobile && (
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
        )}
      </div>
    </div>
  )
}

export default HeaderRender
