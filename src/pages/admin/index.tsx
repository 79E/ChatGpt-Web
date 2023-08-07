import { DefaultFooter, PageContainer, ProLayout } from '@ant-design/pro-components'
import styles from './index.module.less'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Dropdown } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import menuList from '@/routers/menu_list'
import { chatStore, userStore } from '@/store'
import OpenAiLogo from '@/components/OpenAiLogo'

function AdminPage() {
  const navigate = useNavigate()
  const { token, user_info, logout } = userStore()
  const { clearChats } = chatStore()
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
  if (!token || user_info?.role !== 'administrator') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <OpenAiLogo rotate width="3em" height="3em" />
      </div>
    )
  }
  return (
    <div className={styles.admin}>
      <ProLayout
        title="后台管理系统"
        logo={import.meta.env.VITE_APP_LOGO}
        layout="mix"
        splitMenus={false}
        contentWidth="Fluid"
        fixedHeader
        fixSiderbar
        theme="light"
        contentStyle={
          {
            //   height: 'calc(100vh - 10px)'
            //   background: 'red'
          }
        }
        siderMenuType="group"
        menu={{
          locale: false,
          collapsedShowGroupTitle: false,
        }}
        // settings={{}}
        suppressSiderWhenMenuEmpty
        siderWidth={260}
        onPageChange={(location) => {
          setSelectedKeys([`${location?.pathname}`])
        }}
        menuExtraRender={() => <div />}
        route={menuList.admin}
        menuItemRender={(item: any, dom: React.ReactNode) => {
          const target = item.path?.indexOf('http') != -1 ? '_blank' : '_self'
          return (
            <Link key={item.path} to={`${item.path}`} target={target}>
              {dom}
            </Link>
          )
        }}
        avatarProps={{
          src: user_info?.avatar,
          size: 'small',
          title: '超级管理员',
          render: (props: any, dom: React.ReactNode) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
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
                {dom}
              </Dropdown>
            )
          }
        }}
        menuFooterRender={(props: any) => {
          if (props?.collapsed) return undefined
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12
              }}
            >
              <div>© 2023 Made with love</div>
              <div>by Chatgpt</div>
            </div>
          )
        }}
        menuProps={{
          onSelect: (e: any) => {
            if (e.key.indexOf('http') === -1 && !selectedKeys.includes(e.key)) {
              setSelectedKeys([...e.selectedKeys])
            }
          },
          onClick: (r: any) => {
            if (r.key.indexOf('http') === -1 && !selectedKeys.includes(r.key)) {
              setSelectedKeys([...r.keyPath])
            }
          },
          selectedKeys: [...selectedKeys],
          theme: 'light'
        }}
        breadcrumbRender={() => []}
        footerRender={() => (
          <DefaultFooter
            links={[{ key: 'github', title: 'github', href: 'https://github.com/79E/ChatGpt-Web' }]}
            copyright="ChatGpt"
          />
        )}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  )
}

export default AdminPage
