import PropTypes from 'prop-types'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useRef } from 'react'
import blogService from '../services/blogs'
import { List, ListItem, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useShowNotification } from '../context/notificationContext'

const Blogs = () => {
  const queryClient = useQueryClient()
  const showNotification = useShowNotification()

  const { data, status, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const mutation = useMutation({
    mutationFn: data => blogService.create(data),
    onSuccess: data => {
      const blogs = queryClient.getQueryData(['blogs'])
      console.log(data, blogs)
      queryClient.setQueryData(['blogs'], [...blogs, data])
      queryClient.setQueryData(['blogs', data.id], data)
    },
  })

  const blogFormRef = useRef(null)

  if (status === 'pending') {
    return (
      <Typography variant="body1" component="p">
        loading user
      </Typography>
    )
  }

  if (status === 'error') {
    return (
      <Typography variant="body1" component="p">
        error: {error.message}
      </Typography>
    )
  }

  const handleCreate = async (title, author, url) => {
    try {
      mutation.mutate({ title, author, url })

      showNotification({
        status: 'success',
        text: `a new blog ${title} by ${author} added`,
      })
      blogFormRef.current.toggleVisibility()
    } catch (err) {
      console.log(err)
      showNotification({
        status: 'error',
        text: `a new blog ${title} by ${author} couldn't be added`,
      })
    }
  }

  return (
    <>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>
      <List>
        {data.map(blog => (
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
