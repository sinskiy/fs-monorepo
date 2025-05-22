import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => (await axios.get(baseUrl)).data
export const createAnecdote = async anecdote =>
  (await axios.post(baseUrl, anecdote)).data
export const addVote = async anecdote =>
  (
    await axios.put(`${baseUrl}/${anecdote.id}`, {
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  ).data
