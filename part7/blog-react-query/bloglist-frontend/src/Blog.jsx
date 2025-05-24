import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import blogService from './services/blogs'
import Button from '@mui/material/Button'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Link as StyledLink,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { useContext } from 'react'
import UserContext from './context/userContext'

const Blog = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { id } = useParams()

  const [user] = useContext(UserContext)

  const { data, status, error } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id),
  })

  if (status === 'pending') {
    return (
      <Typography variant="body1" component="p">
        loading blog
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

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(
      `Remove blog ${data.title} by ${data.author}`
    )
    if (isConfirmed) {
      await blogService.deletePost(data.id)
      navigate('/')
    }
  }

  const handleLikeClick = async () => {
    await blogService.addLike(data)
    queryClient.invalidateQueries({ queryKey: ['blogs', id] })
  }

  const handleComment = async e => {
    e.preventDefault()
    await blogService.addComment(data.id, { text: e.target.comment.value })
    e.target.comment.value = ''
    queryClient.invalidateQueries({ queryKey: ['blogs', id] })
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h2">
            {data.title}
          </Typography>
          <StyledLink to={data.url} component={Link}>
            {data.url}
          </StyledLink>
          <Typography
            variant="overline"
            component="p"
            sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}
          >
            likes {data.likes}
            <Button variant="outlined" onClick={handleLikeClick}>
              like
            </Button>
          </Typography>
          <Typography variant="body1" component="p">
            {data.user?.username}
          </Typography>
        </CardContent>
        <CardActions>
          {user && data.user?.username === user.username && (
            <Button variant="outlined" onClick={handleDeleteClick}>
              remove
            </Button>
          )}
        </CardActions>
      </Card>
      <Typography variant="h5" component="h3" sx={{ mt: 2 }}>
        comments
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={handleComment}
      >
        <TextField
          type="text"
          id="comment"
          label="comment"
          variant="outlined"
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ maxWidth: 'fit-content', mt: 1 }}
        >
          add comment
        </Button>
      </Box>
      {data.comments.length > 0 ? (
        <List>
          {data.comments.map((comment, i) => (
            <ListItem key={i}>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" component="p">
          no comments yet :c
        </Typography>
      )}
    </>
  )
}

export default Blog
