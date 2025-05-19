import searchReducer from './reducers/searchReducer'
import anecdoteReducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    search: searchReducer,
    notification: notificationReducer,
  },
})

export default store
