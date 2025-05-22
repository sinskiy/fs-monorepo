import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { addVote, getAnecdotes } from './requests'
import { NotificationContext, useShowNotification } from './notificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const showNotification = useShowNotification(NotificationContext)

  const addVoteMutation = useMutation({
    mutationFn: addVote,
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(anecdote =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      )
      showNotification(`anecdote '${updatedAnecdote.content}' voted`)
    },
  })

  const handleVote = anecdote => {
    addVoteMutation.mutate(anecdote)
  }

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  if (anecdotesQuery.isError) {
    return <p>anecdote service not available due to problems in server</p>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotesQuery.isLoading ? (
        <p>loading...</p>
      ) : (
        anecdotesQuery.data.map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default App
