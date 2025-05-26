import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const books = useQuery(ALL_BOOKS, { variables: { genre } })
  const allBooks = useQuery(ALL_BOOKS, { variables: { genre: null } })

  const allGenres =
    allBooks.data?.allBooks.map(book => book.genres).flat() ?? []
  const genres = Array.from(new Set(allGenres))

  if (books.loading) {
    return <p>loading books</p>
  }

  return (
    <div>
      <h2>books</h2>

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

      {genres.map(genre => (
        <button onClick={() => setGenre(genre)} key={genre}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
