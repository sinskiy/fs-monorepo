import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useEffect } from 'react'
import { useContext } from 'react'
import TokenContext from '../TokenContext'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigate = useNavigate()

  const [, setToken] = useContext(TokenContext)
  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      navigate('/books')
    }
  }, [result.data])

  const handleLogin = e => {
    e.preventDefault()
    login({ variables: { username: e.target.name.value } })
  }

  return (
    <main>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="name">name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input type="password" name="password" id="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </main>
  )
}

export default Login
