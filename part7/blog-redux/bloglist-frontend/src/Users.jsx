import { useQuery } from '@tanstack/react-query'
import userService from './services/users'
import { Link } from 'react-router'
import TableContainer from '@mui/material/TableContainer'
import StyledLink from '@mui/material/Link'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

const Users = () => {
  const { data, status, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (status === 'pending') {
    return (
      <Typography variant="body1" component="p">
        loading users
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
      <Typography variant="h5" component="h2">
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <StyledLink component={Link} to={`/users/${user.id}`}>
                    {user.username}
                  </StyledLink>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users
