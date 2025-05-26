import { useState } from 'react'
import { GET_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const books = useQuery(GET_BOOKS, { variables: { genre } })

  if (books.loading) {
    return <p>loading books</p>
  }

  const allGenres = books.data.allBooks.map(book => book.genres).flat()
  const genres = Array.from(new Set(allGenres))

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
