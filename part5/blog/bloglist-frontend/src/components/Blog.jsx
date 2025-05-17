import { useState } from 'react'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [isVisible, setIsVisible] = useState(false)

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
            <button>like</button>
          </p>
          <p>{blog.user?.username}</p>
        </>
      )}
    </div>
  )
}

export default Blog
