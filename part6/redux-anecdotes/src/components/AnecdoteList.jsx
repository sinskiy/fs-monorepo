import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import {
  resetNotification,
  updateNotification,
} from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state =>
    state.anecdotes.filter(anecdote => anecdote.content.includes(state.search))
  )

  const handleVoteClick = (anecdoteId, anecdoteContent) => {
    dispatch(vote(anecdoteId))
    dispatch(updateNotification(`you voted '${anecdoteContent}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => handleVoteClick(anecdote.id, anecdote.content)}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
