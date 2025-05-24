import { useState } from 'react'
import loginService from '../services/login'
import { showNotification } from '../reducers/notificationReducer'
import Message from '../components/Message'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { setUser } from '../reducers/userReducer'

const User = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch {
      dispatch(
        showNotification({
          status: 'error',
          text: 'wrong username or password',
        })
      )
    }
  }

  return (
    <>
      <div>
        <h2>log in to application</h2>
        <Message />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    </>
  )
}

export default User
