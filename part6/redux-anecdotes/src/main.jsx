import ReactDOM from 'react-dom/client'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import searchReducer from './reducers/searchReducer'
import anecdoteReducer from './reducers/anecdoteReducer'

const combinedReducers = combineReducers({
  search: searchReducer,
  anecdotes: anecdoteReducer,
})

const store = createStore(combinedReducers)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
