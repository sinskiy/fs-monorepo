import { useState, useEffect, useImperativeHandle, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from './reducers/notificationReducer'
import { addBlog, setBlogs, updateBlog } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = e => {
    e.preventDefault()

    dispatch(setUser(null))
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  if (user === null) {
    return <User />
  }

  return <Blogs handleLogout={handleLogout} />
}

const User = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch {
      dispatch(
        showNotification({
          status: 'error',
          text: 'wrong username or password',
        })
      )
    }
  }
  return (
    <>
      <div>
        <h2>log in to application</h2>
        <Message />
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

const Blogs = ({ handleLogout }) => {
  const dispatch = useDispatch()

  const username = useSelector(state => state.user.username)

  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    blogService.getAll().then(blogs => dispatch(setBlogs(blogs)))
  }, [])

  const handleLikeClick = async blog => {
    const response = await blogService.addLike(blog)
    dispatch(updateBlog(response))
  }

  const blogFormRef = useRef(null)

  const handleCreate = async (title, author, url) => {
    try {
      const result = await blogService.create({ title, author, url })
      dispatch(addBlog(result))

      dispatch(
        showNotification({
          status: 'success',
          text: `a new blog ${title} by ${author} added`,
        })
      )
      blogFormRef.current.toggleVisibility()
    } catch (err) {
      console.log(err)
      dispatch(
        showNotification({
          status: 'error',
          text: `a new blog ${title} by ${author} couldn't be added`,
        })
      )
    }
  }

  return (
    <>
      <div>
        <h2>blogs</h2>
        <Message />
        <p>
          {username} logged in<button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <BlogForm handleCreate={handleCreate} />
        </Togglable>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} handleLikeClick={handleLikeClick} />
        ))}
      </div>
    </>
  )
}
Blogs.propTypes = {
  handleLogout: PropTypes.func.isRequired,
}

const Togglable = ({ children, buttonLabel, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
}
Togglable.propTypes = {
  children: PropTypes.elementType.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  ref: PropTypes.object.isRequired,
}

const Message = () => {
  const notification = useSelector(state => state.notification)
  if (notification.text) {
    return (
      <div className={`message ${notification.status}`}>
        {notification.text}
      </div>
    )
  }
}

export default App
