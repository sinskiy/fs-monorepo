import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import userService from './services/users'
import { List, ListItem, ListItemText, Typography } from '@mui/material'

const User = () => {
  const { id } = useParams()

  const { data, status, error } = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
  })

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

  return (
    <>
      <Typography variant="h4" component="h2">
        {data.username}
      </Typography>
      <Typography variant="h5" component="h3">
        added blogs
      </Typography>
      {data.blogs.length > 0 ? (
        <List>
          {data.blogs.map(blog => (
            <ListItem key={blog.id}>
              <ListItemText>{blog.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" component="p">
          no blogs yet
        </Typography>
      )}
    </>
  )
}

export default User
