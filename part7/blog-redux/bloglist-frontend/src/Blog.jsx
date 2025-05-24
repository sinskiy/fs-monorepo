import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import blogService from './services/blogs'
import { useSelector } from 'react-redux'

const Blog = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { id } = useParams()

  const username = useSelector(state => state.user?.username)

  const { data, status, error } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => blogService.getById(id),
  })

  if (status === 'pending') {
    return <p>loading blog</p>
  }

  if (status === 'error') {
    return <p>error: {error.message}</p>
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
      <h1>{data.title}</h1>
      <p>{data.url}</p>
      <p>
        likes {data.likes}
        <button onClick={handleLikeClick}>like</button>
      </p>
      <p>{data.user?.username}</p>
      {username && data.user?.username === username && (
        <button onClick={handleDeleteClick}>remove</button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <label htmlFor="comment" className="sr-only">
          comment
        </label>
        <input type="text" name="comment" id="comment" />
        <button type="submit">add comment</button>
      </form>
      {data.comments.length > 0 ? (
        <ul>
          {data.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>no comments yet :c</p>
      )}
    </>
  )
}

export default Blog
