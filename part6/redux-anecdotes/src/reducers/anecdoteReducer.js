import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  }
}

const sortAnecdotes = anecdotes => anecdotes.sort((a, b) => b.votes - a.votes)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      state.forEach(anecdote => {
        if (anecdote.id === action.payload) {
          anecdote.votes++
        }
      })

      state = sortAnecdotes(state)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { addVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = anecdote => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.voteFor(anecdote)
    dispatch(addVote(votedAnecdote.id))
  }
}

export default anecdoteSlice.reducer
