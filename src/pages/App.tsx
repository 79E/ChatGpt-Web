import { useRoutes } from 'react-router-dom'
import routers from '../routers'

function App() {
  const routesElement = useRoutes(routers)
  return routesElement
}

export default App
