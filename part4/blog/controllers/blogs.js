import { Router } from 'express'
import Blog from '../models/blog.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const blogsRouter = Router()

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  } else {
    return null
  }
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'invalid user id' })
  }

  const blog = new Blog({ ...request.body, user: user._id })
  user.blogs = user.blogs.concat(blog._id)

  const blogPromise = blog.save()
  const userPromise = user.save()
  const [result] = await Promise.all([blogPromise, userPromise])

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

export default blogsRouter
