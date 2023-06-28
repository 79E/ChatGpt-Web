import { useState, useEffect } from 'react'

function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgentInfo = navigator.userAgent
    const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = false
    for (let i = 0; i < agents.length; i++) {
      if (userAgentInfo.indexOf(agents[i]) > 0) {
        flag = true
        break
      }
    }
    setIsMobile(flag)
  }, [])

  return isMobile
}

export default useMobile;
