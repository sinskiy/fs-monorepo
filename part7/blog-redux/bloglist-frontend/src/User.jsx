import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import userService from './services/users'

const User = () => {
  const { id } = useParams()

  const { data, status, error } = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
  })

  if (status === 'pending') {
    return <p>loading user</p>
  }

  if (status === 'error') {
    return <p>error: {error.message}</p>
  }

  return (
    <>
      <h1>{data.username}</h1>
      <h3>added blogs</h3>
      {data.blogs.length > 0 ? (
        <ul>
          {data.blogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      ) : (
        <p>no blogs yet</p>
      )}
    </>
  )
}

export default User
