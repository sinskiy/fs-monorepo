import blogService from './services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setUser } from './reducers/userReducer'
import User from './components/User'
import Blogs from './components/Blogs'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

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

  if (user === null) {
    return <User />
  }

  return <Blogs handleLogout={handleLogout} />
}

export default App
