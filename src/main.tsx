import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import { BrowserRouter } from 'react-router-dom'
import AuthRouter from './routers/auth_router'
import Global from './components/Global'
import OpenAiLogo from './components/OpenAiLogo'

import '@/styles/global.less'
import '@/styles/markdown.less'
import '@/styles/highlight.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <AuthRouter>
      <Global>
        <React.Suspense
          fallback={(
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
          )}
        >
          <App />
        </React.Suspense>
      </Global>
    </AuthRouter>
  </BrowserRouter>
)
