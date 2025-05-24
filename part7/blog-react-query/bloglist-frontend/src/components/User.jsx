import { useContext, useState } from 'react'
import loginService from '../services/login'
import Message from '../components/Message'
import blogService from '../services/blogs'
import { Box, Button, TextField, Typography } from '@mui/material'
import UserContext from '../context/userContext'
import { useShowNotification } from '../context/notificationContext'

const User = () => {
  const [, setUser] = useContext(UserContext)
  const showNotification = useShowNotification()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification({
        status: 'error',
        text: 'wrong username or password',
      })
    }
  }

  return (
    <>
      <div>
        <Typography variant="h5" component="h3">
          log in to application
        </Typography>
        <Message />
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
          maxWidth="sm"
        >
          <TextField
            type="text"
            id="username"
            label="username"
            value={username}
            onChange={e => setUsername(e.currentTarget.value)}
            variant="outlined"
          />
          <TextField
            type="password"
            id="password"
            label="password"
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            variant="outlined"
          />
          <Button variant="contained" type="submit">
            login
          </Button>
        </Box>
      </div>
    </>
  )
}

export default User
