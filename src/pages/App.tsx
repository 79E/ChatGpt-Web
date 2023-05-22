import { useRoutes } from 'react-router-dom'
import { webRouter, adminRouter } from '../routers'
import { useMemo } from 'react'
import { userStore } from '@/store'

function App() {
  const { user_info } = userStore()

  const routers: Array<any> = useMemo(() => {
    let routerList = [...webRouter]
    if (user_info?.role === 'administrator') {
      routerList = [...routerList, ...adminRouter]
    }
    return routerList
  }, [user_info])

  const routesElement = useRoutes([...routers])
  return routesElement
}

export default App
