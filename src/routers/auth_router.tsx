import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import routes, { searchRouteDetail } from './index'

type AuthRouterProps = {
  children?: React.ReactNode
}

function AuthRouter(props: AuthRouterProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const tokenStorage = localStorage.getItem('token')

  const { pathname } = location

  const routerDetail = searchRouteDetail(pathname, routes)
  const title = routerDetail?.configure?.title
  useEffect(() => {
    if (title) {
      document.title = title
    }
    if (routerDetail?.configure?.verifToken && !tokenStorage) {
      navigate('/', {
        state: {
          form: routerDetail.path
        }
      })
    }
  }, [pathname, routerDetail])

  return <>{props.children}</>
}

export default AuthRouter
