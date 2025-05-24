import { Link as StyledLink, ListItemText } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const Blog = ({ blog }) => {
  return (
    <ListItemText>
      <StyledLink component={Link} to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </StyledLink>
    </ListItemText>
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
}

export default Blog
