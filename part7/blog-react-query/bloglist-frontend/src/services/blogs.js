import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response =>
    response.data.sort((a, b) => b.likes - a.likes)
  )
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const addLike = async blog => {
  const config = {
    headers: { Authorization: token },
  }

  const newBlog = {
    user: blog.user?.id,
    likes: blog.likes + 1,

    author: blog.author,
    title: blog.title,
    url: blog.url,
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, newBlog, config)
  return response.data
}

const deletePost = async id => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, addLike, deletePost, setToken }
