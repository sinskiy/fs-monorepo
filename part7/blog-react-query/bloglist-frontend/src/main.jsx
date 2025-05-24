import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Users from './Users.jsx'
import User from './User.jsx'
import Blog from './Blog.jsx'
import { UserProvider } from './context/userContext.jsx'
import { NotificationProvider } from './context/notificationContext.jsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="users">
                <Route index element={<Users />} />
                <Route path=":id" element={<User />} />
              </Route>
              <Route path="blogs/:id" element={<Blog />} />
            </Route>
          </Routes>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
