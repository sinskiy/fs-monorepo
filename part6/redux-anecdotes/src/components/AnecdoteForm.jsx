import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAnecdoteCreation = async e => {
    e.preventDefault()
    dispatch(createAnecdote(e.target.text.value))
    dispatch(setNotification(`you created '${e.target.text.value}'`, 5))
    e.target.text.value = ''
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
