import React from 'react'
import type { RouteObject } from 'react-router-dom'

type ConfigureType = {
  verifToken?: boolean
  title?: string
  role: Array<'user' | 'administrator' | string>
}

export interface RouteOptions extends Omit<Omit<RouteObject, 'children'>, 'index'> {
  index?: boolean
  children?: RouteOptions[]
  configure?: ConfigureType
}

const ChatPage = React.lazy(() => import('@/pages/chat'))
const DrawPage = React.lazy(() => import('@/pages/draw'))
const ShopPage = React.lazy(() => import('@/pages/shop'))
const UserPage = React.lazy(() => import('@/pages/user'))
const LoginPage = React.lazy(() => import('@/pages/login'))
const ResultPage = React.lazy(() => import('@/pages/result'))
const Page404 = React.lazy(() => import('@/pages/404'))

import AdminPage from '@/pages/admin'
import AdminCarmiPage from '@/pages/admin/carmi'
import AdminUserPage from '@/pages/admin/user'
import AdminTurnoverPage from '@/pages/admin/turnover'
import AdminSigninPage from '@/pages/admin/signin'
import AdminMessagePage from '@/pages/admin/message'
import AdminProductPage from '@/pages/admin/product'
import AdminTokenPage from '@/pages/admin/token'
import AdminConfigPage from '@/pages/admin/config'
import AdminPaymentPage from '@/pages/admin/payment'
import AdminOrderPage from '@/pages/admin/order'
import AdminNotificationPage from '@/pages/admin/notification'


export const webRouter: RouteOptions[] = [
  {
    id: 'ChatPage',
    path: '/',
    element: <ChatPage />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'DrawPage',
    path: '/draw',
    element: <DrawPage />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'ShopPage',
    path: '/shop',
    element: <ShopPage />,
    children: [],
    configure: {
      verifToken: true,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'UserPage',
    path: '/user',
    element: <UserPage />,
    children: [],
    configure: {
      verifToken: true,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'LoginPage',
    path: '/login',
    element: <LoginPage />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'ResultPage',
    path: '/result',
    element: <ResultPage />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'Page404',
    path: '/404',
    element: <Page404 />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  },
  {
    id: 'Page404',
    path: '*',
    element: <Page404 />,
    children: [],
    configure: {
      verifToken: false,
      role: ['user', 'administrator']
    }
  }
]

export const adminRouter: RouteOptions[] = [
  {
    id: 'AdminPage',
    path: '/admin',
    element: <AdminPage />,
    children: [
      {
        id: 'AdminCarmiPage',
        path: '/admin/carmi',
        element: <AdminCarmiPage />,
        index: false,
        configure: {
          title: '卡密管理',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminUserPage',
        path: '/admin/user',
        element: <AdminUserPage />,
        index: true,
        configure: {
          title: '用户管理',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminTurnoverPage',
        path: '/admin/turnover',
        element: <AdminTurnoverPage />,
        index: false,
        configure: {
          title: '消费记录',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminSigninPage',
        path: '/admin/signin',
        element: <AdminSigninPage />,
        index: false,
        configure: {
          title: '签到记录',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminMessagePage',
        path: '/admin/messages',
        element: <AdminMessagePage />,
        index: false,
        configure: {
          title: '对话记录',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminProductPage',
        path: '/admin/product',
        element: <AdminProductPage />,
        index: false,
        configure: {
          title: '商品列表',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminPaymentPage',
        path: '/admin/payment',
        element: <AdminPaymentPage />,
        index: false,
        configure: {
          title: '支付配置',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminTokenPage',
        path: '/admin/token',
        element: <AdminTokenPage />,
        index: false,
        configure: {
          title: 'Toekn管理',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminOrderPage',
        path: '/admin/order',
        element: <AdminOrderPage />,
        index: false,
        configure: {
          title: '订单管理',
          verifToken: true,
          role: ['administrator']
        }
      },
      {
        id: 'AdminConfigPage',
        path: '/admin/config',
        element: <AdminConfigPage />,
        index: false,
        configure: {
          title: '系统配置',
          verifToken: true,
          role: ['administrator']
        }
      },
	  {
        id: 'AdminNotificationPage',
        path: '/admin/notification',
        element: <AdminNotificationPage />,
        index: false,
        configure: {
          title: '系统通知配置',
          verifToken: true,
          role: ['administrator']
        }
      }
    ],
    configure: {
      verifToken: true,
      role: ['administrator']
    }
  }
]

export function searchRouteDetail(path: string, routes: RouteOptions[]): RouteOptions | null {
  let detail = null
  const forRouter = (path: string, routes: RouteOptions[]) => {
    for (const item of routes) {
      if (item.path === path) {
        detail = item
      }
      if (item.children && item.children.length > 0) {
        forRouter(path, item.children)
      }
    }
  }

  forRouter(path, routes)

  return detail
}

export default {}
