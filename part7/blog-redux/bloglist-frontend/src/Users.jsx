import { useQuery } from '@tanstack/react-query'
import userService from './services/users'

const Users = () => {
  const { data, status, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (status === 'pending') {
    return <p>loading users</p>
  }

  if (status === 'error') {
    return <p>error: {error.message}</p>
  }

  return (
    <>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <td></td>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
