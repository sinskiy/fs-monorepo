import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const Authors = () => {
  const authors = useQuery(ALL_AUTHORS)

  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (authors.loading) {
    return <p>loading authors</p>
  }

  const handleSetBirthyear = e => {
    e.preventDefault()
    setBirthyear({
      variables: {
        name: e.target.name.value,
        year: Number(e.target.born.value),
      },
    })
    e.target.name.value = ''
    e.target.born.value = ''
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSetBirthyear}>
        <label htmlFor="name">name</label>
        <select name="name" id="name">
          {authors.data.allAuthors.map(a => (
            <option key={a.name}>{a.name}</option>
          ))}
        </select>
        <label htmlFor="born">born</label>
        <input type="number" name="born" id="born" />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
