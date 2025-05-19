import { useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer'
import {
  resetNotification,
  updateNotification,
} from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAnecdoteCreation = e => {
    e.preventDefault()
    dispatch(newAnecdote(e.target.text.value))
    dispatch(updateNotification(`you created '${e.target.text.value}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
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
