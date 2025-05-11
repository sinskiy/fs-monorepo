import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = e => {
    e.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  if (user === null) {
    return <User setUser={setUser} />
  }

  return <Blogs username={user?.username} handleLogout={handleLogout} />
}

const User = ({ setUser }) => {
  const [message, setMessage] = useState(null)
  const showMessage = message => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showMessage({ status: 'success', text: 'wrong username or password' })
    }
  }
  return (
    <>
      <div>
        <h2>log in to application</h2>
        <Message status={message?.status} text={message?.text} />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    </>
  )
}

const Blogs = ({ username, handleLogout }) => {
  const [message, setMessage] = useState(null)
  const showMessage = message => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  return (
    <>
      <div>
        <h2>blogs</h2>
        <Message status={message?.status} text={message?.text} />
        <p>
          {username} logged in<button onClick={handleLogout}>logout</button>
        </p>
        <BlogForm setBlogs={setBlogs} showMessage={showMessage} />
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  )
}

const BlogForm = ({ setBlogs, showMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async e => {
    e.preventDefault()

    try {
      const result = await blogService.create({ title, author, url })
      setBlogs(blogs => [...blogs, result])

      setTitle('')
      setAuthor('')
      setUrl('')

      showMessage({
        status: 'success',
        text: `a new blog ${title} by ${author} added`,
      })
    } catch (err) {
      console.log(err)
      showMessage({
        status: 'error',
        text: `a new blog ${title} by ${author} couldn't be added`,
      })
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            type="text"
            name="author"
            id="author"
            value={author}
            onChange={e => setAuthor(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={e => setUrl(e.currentTarget.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const Message = ({ status, text }) =>
  status && <div className={`message ${status}`}>{text}</div>

export default App
