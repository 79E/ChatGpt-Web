import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { BrowserRouter } from 'react-router-dom';
import AuthRouter from './routers/auth_router';
import Global from './components/Global';

import '@/styles/global.less';
import '@/styles/markdown.less';
import '@/styles/highlight.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
      <AuthRouter>
        <Global>
          <App />
        </Global>
      </AuthRouter>
    </BrowserRouter>
)
