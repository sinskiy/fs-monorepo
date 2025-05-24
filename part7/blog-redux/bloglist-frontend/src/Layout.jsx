import { Outlet } from 'react-router'
import Message from './components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'

const Layout = () => {
  const dispatch = useDispatch()

  const username = useSelector(state => state.user?.username)

  const handleLogout = e => {
    e.preventDefault()

    dispatch(setUser(null))
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  return (
    <div>
      {username && (
        <>
          <h2>Blogs</h2>
          <Message />
          <p>
            {username} logged in<button onClick={handleLogout}>logout</button>
          </p>
        </>
      )}
      <Outlet />
    </div>
  )
}

export default Layout
