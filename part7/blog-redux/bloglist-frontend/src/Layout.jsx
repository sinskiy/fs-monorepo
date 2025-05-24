import { Link, Outlet } from 'react-router'
import Message from './components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'
import { useEffect } from 'react'

const Layout = () => {
  const dispatch = useDispatch()

  const username = useSelector(state => state.user?.username)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = e => {
    e.preventDefault()

    dispatch(setUser(null))
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  return (
    <>
      <header>
        <nav
          style={{
            backgroundColor: 'lightgray',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link to="/">blogs</Link>
          <Link to="/users">users</Link>
          {username && (
            <>
              <p>{username} logged in</p>
              <button onClick={handleLogout}>logout</button>
            </>
          )}
        </nav>
      </header>
      <main>
        <h2>blog app</h2>
        <Message />
        <Outlet />
      </main>
    </>
  )
}

export default Layout
