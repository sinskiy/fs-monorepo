import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateSubmit = e => {
    e.preventDefault()

    handleCreate(title, author, url)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateSubmit}>
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

BlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
}

export default BlogForm
