import PropTypes from 'prop-types'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { addBlog, setBlogs } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { List, ListItem } from '@mui/material'

const Blogs = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    blogService.getAll().then(blogs => dispatch(setBlogs(blogs)))
  }, [])

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
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      <List>
        {blogs.map(blog => (
          <ListItem key={blog.id}>
            <Blog blog={blog} />
          </ListItem>
        ))}
      </List>
    </>
  )
}
Blogs.propTypes = {
  handleLogout: PropTypes.func.isRequired,
}

export default Blogs
