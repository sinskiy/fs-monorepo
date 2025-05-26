import { useContext } from 'react'
import { Link, Outlet } from 'react-router'
import TokenContext from './TokenContext'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useContext(TokenContext)

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`)
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        data => {
          if (data) {
            return { allBooks: data.allBooks.concat(addedBook) }
          }
        }
      )
    },
  })

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
