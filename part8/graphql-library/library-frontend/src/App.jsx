import { useContext } from 'react'
import { Link, Outlet } from 'react-router'
import TokenContext from './TokenContext'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [token, setToken] = useContext(TokenContext)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        {token ? (
          <>
            <Link to="/add">add book</Link>
            <Link to="/recommendations">recommend</Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </div>
      <Outlet />
    </div>
  )
}

export default App
