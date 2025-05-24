import PropTypes from 'prop-types'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import Message from './Message'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { addBlog, setBlogs, updateBlog } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

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

export default Blogs
