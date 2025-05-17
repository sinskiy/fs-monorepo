import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [isVisible, setIsVisible] = useState(false)

  const handleLikeClick = async () => {
    const response = await blogService.addLike(blog)
    setBlogs(blogs =>
      blogs.map(blog => (blog.id === response.id ? response : blog))
    )
  }

  const handleDeleteClick = async () => {
    await blogService.deletePost(blog.id)
    setBlogs(blogs => blogs.filter(currentBlog => currentBlog.id !== blog.id))
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
            <button onClick={handleLikeClick}>like</button>
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

export default Blog
