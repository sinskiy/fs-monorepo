import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, setBlogs, handleLikeClick, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [isVisible, setIsVisible] = useState(false)

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (isConfirmed) {
      await blogService.deletePost(blog.id)
      setBlogs(blogs => blogs.filter(currentBlog => currentBlog.id !== blog.id))
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'hide' : 'view'}
        </button>
      </div>
      {isVisible && (
        <>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={() => handleLikeClick(blog)}>like</button>
          </p>
          <p>{blog.user?.username}</p>
          {blog.user?.username === username && (
            <button onClick={handleDeleteClick}>remove</button>
          )}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
  username: PropTypes.string.isRequired,
  setBlogs: PropTypes.func.isRequired,
  handleLikeClick: PropTypes.func.isRequired,
}

export default Blog
