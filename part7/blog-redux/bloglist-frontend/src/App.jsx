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

  if (user === null) {
    return <User />
  }

  return <Blogs />
}

export default App
