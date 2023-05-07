import React, { useEffect, useMemo, useState } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/es/components/Header'
import styles from './index.module.less'
import {
  AppstoreOutlined,
  CloudSyncOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  SyncOutlined
} from '@ant-design/icons'
import useStore from '@/store'
import { Avatar, Button, Dropdown, message } from 'antd'
import { getEmailPre } from '@/utils'
import MenuList from '../MenuList'
import { getKeyUsage } from '@/request/api'

function HeaderRender(props: HeaderViewProps, defaultDom: React.ReactNode) {
  const isProxy = import.meta.env.VITE_APP_MODE === 'proxy'

  const { token, user_detail, logout, setLoginModal, config } = useStore()

  const renderLogo = useMemo(() => {
    if (typeof props.logo === 'string')
      return <img className={styles.header__logo} src={props.logo} />
    return <>{props.logo}</>
  }, [props.logo])

  useEffect(()=>{
    onRefreshBalance()
  },[token, config.api, config.api_key])

  const [balance, setBalance] = useState({
    number: 0,
    loading: false
  })

  function onRefreshBalance (){
    if(token){
      // 获取用户信息
    }else if(config.api_key && config.api){
      setBalance(b => ({...b, loading: true}));
      getKeyUsage(config.api , config.api_key).then((res)=>{
        console.log(res)
        setBalance(b => ({number: res, loading: false}));
      }).finally(()=>{
        setBalance(b => ({...b, loading: false}));
      })
    }else{
      message.error('请填写正确配置')
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
         <div className={styles.header__balance} onClick={()=>{
          onRefreshBalance()
         }}
         >
            <p>{balance.number}</p> <SyncOutlined spin={balance.loading} />
         </div>
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
