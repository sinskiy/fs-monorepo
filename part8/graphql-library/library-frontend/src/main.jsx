import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Authors from './components/Authors.jsx'
import Books from './components/Books.jsx'
import NewBook from './components/NewBook.jsx'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import Login from './components/Login.jsx'
import { TokenProvider } from './TokenContext.jsx'
import { setContext } from '@apollo/client/link/context'
import Recommendations from './components/Recommendations.jsx'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <TokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="authors" element={<Authors />} />
              <Route path="books" element={<Books />} />
              <Route path="add" element={<NewBook />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TokenProvider>
    </ApolloProvider>
  </React.StrictMode>
)
