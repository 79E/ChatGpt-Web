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
import useStore from '@/store'
import { Avatar, Button, Dropdown } from 'antd'
import { getAiKey, getEmailPre } from '@/utils'
import MenuList from '../MenuList'
import { getKeyUsage, getUserInfo } from '@/request/api'
import { useNavigate } from 'react-router-dom'

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  const isProxy = import.meta.env.VITE_APP_MODE === 'proxy'

  const navigate = useNavigate()

  const { token, user_detail, logout, setLoginModal, config } = useStore()

  const renderLogo = useMemo(() => {
    if (typeof props.logo === 'string')
      return <img className={styles.header__logo} src={props.logo} />
    return <>{props.logo}</>
  }, [props.logo])

  useEffect(() => {
    onRefreshBalance()
  }, [user_detail, token, config.api, config.api_key])

  const [balance, setBalance] = useState<{
    number: string | number
    loading: boolean
  }>({
    number: 0,
    loading: false
  })

  function onRefreshBalance() {
    const systemConfig = getAiKey(config)
    setBalance((b) => ({ ...b, loading: true }))
    if (token) {
      // 获取用户信息
      getUserInfo()
        .then((res) => {
          if (res.code) return
          setBalance((b) => ({ ...b, number: res.data.integral, loading: false }))
        })
        .finally(() => {
          setBalance((b) => ({ ...b, loading: false }))
        })
    } else if (systemConfig.api_key && systemConfig.api) {
      getKeyUsage(systemConfig.api, systemConfig.api_key)
        .then((res) => {
          setBalance((b) => ({ number: res, loading: false }))
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
        {isProxy ? (
          <></>
        ) : token ? (
          <Dropdown
            arrow
            placement="bottomRight"
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'yonghuxinxi',
                  icon: <UserOutlined />,
                  label: '用户信息',
                  onClick: () => {
                    navigate('/shop')
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
                  key: 'zhifuzhongxin',
                  icon: <WalletOutlined />,
                  label: '支付中心',
                  onClick: () => {
                    navigate('/shop')
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
        {((getAiKey(config).api && getAiKey(config).api_key) || token) && (
          <div
            className={styles.header__balance}
            onClick={() => {
              onRefreshBalance()
            }}
          >
            <p>余额：{balance.number}</p> <SyncOutlined spin={balance.loading} />
          </div>
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
