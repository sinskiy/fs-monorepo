import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAnecdoteCreation = e => {
    e.preventDefault()
    dispatch(createAnecdote(e.target.text.value))
  }

  return (
    <>
      <h2>create new</h2>

      <form onSubmit={handleAnecdoteCreation}>
        <div>
          <label htmlFor="text">text</label>
          <input id="text" name="text" type="text" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}
export default AnecdoteForm
