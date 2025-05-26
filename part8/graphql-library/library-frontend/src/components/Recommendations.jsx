import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_FAVORITE_GENRE } from '../queries'
import PropTypes from 'prop-types'

const Recommendations = () => {
  const me = useQuery(GET_FAVORITE_GENRE)

  if (me.loading) {
    return <p>loading user</p>
  }

  return (
    <>
      <h2>recommendations</h2>
      <p>books in your favorite genre {me.data.me.favoriteGenre}</p>
      <Books favoriteGenre={me.data.me.favoriteGenre} />
    </>
  )
}

const Books = ({ favoriteGenre }) => {
  const books = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  })

  if (books.loading) {
    return <p>loading books</p>
  }

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.data.allBooks.map(a => (
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
Books.propTypes = {
  favoriteGenre: PropTypes.string,
}

export default Recommendations
