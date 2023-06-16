import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminRouter, searchRouteDetail, webRouter } from './index'
import { userStore } from '@/store'

type AuthRouterProps = {
  children?: React.ReactNode
}

function AuthRouter(props: AuthRouterProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user_info } = userStore()
  const { pathname } = location
  const routerDetail = searchRouteDetail(pathname, [...webRouter, ...adminRouter])
  const title = routerDetail?.configure?.title
  useEffect(() => {
    if (title) {
      document.title = title
    }
    if(token && user_info && location.pathname.includes('/login')){
      navigate('/')
      return 
    }
    const userRole = user_info?.role || 'user'
    if (routerDetail?.configure?.verifToken && !token) {
      navigate('/')
      navigate('/login', {
        state: {
          form: routerDetail?.path
        }
      })
    } else if (token && !routerDetail?.configure?.role.includes(userRole)) {
      navigate('/')
      navigate('/404')
    }
  }, [pathname, routerDetail])

  return <>{props.children}</>
}

export default AuthRouter
