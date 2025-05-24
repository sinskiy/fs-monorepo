import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import notificationReducer from './reducers/notificationReducer.js'
import blogsReducer from './reducers/blogsReducer.js'
import userReducer from './reducers/userReducer.js'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Users from './Users.jsx'
import User from './User.jsx'

const queryClient = new QueryClient()

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="users">
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
)
