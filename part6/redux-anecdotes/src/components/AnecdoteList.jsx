import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(state =>
    state.anecdotes.filter(anecdote => anecdote.content.includes(state.search))
  )

  const handleVoteClick = anecdote => {
    dispatch(vote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVoteClick(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
