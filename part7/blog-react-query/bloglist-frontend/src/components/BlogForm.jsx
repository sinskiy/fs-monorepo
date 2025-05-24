import { Button, TextField, Typography, Box } from '@mui/material'
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
      <Typography variant="h5" component="h3">
        create new
      </Typography>
      <Box
        component="form"
        onSubmit={handleCreateSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        maxWidth="sm"
      >
        <TextField
          type="text"
          id="title"
          label="title"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          variant="outlined"
        />
        <TextField
          type="text"
          id="author"
          label="author"
          value={author}
          onChange={e => setAuthor(e.currentTarget.value)}
          variant="outlined"
        />
        <TextField
          type="url"
          id="url"
          label="url"
          value={url}
          onChange={e => setUrl(e.currentTarget.value)}
          variant="outlined"
        />
        <Button
          variant="contained"
          sx={{ maxWidth: 'fit-content' }}
          type="submit"
        >
          create
        </Button>
      </Box>
    </div>
  )
}

BlogForm.propTypes = {
  handleCreate: PropTypes.func.isRequired,
}

export default BlogForm
