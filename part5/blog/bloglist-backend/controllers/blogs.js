import { Router } from 'express'
import Blog from '../models/blog.js'
import jwt from 'jsonwebtoken'

const blogsRouter = Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (!request.user) {
    return response.status(400).json({ error: 'invalid user id' })
  }

  const blog = new Blog({ ...request.body, user: request.user._id })
  request.user.blogs = request.user.blogs.concat(blog._id)

  const blogPromise = blog.save()
  const userPromise = request.user.save()
  const [result] = await Promise.all([blogPromise, userPromise])

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (!request.user) {
    return response.status(400).json({ error: 'invalid user id' })
  }

  await Blog.findOneAndDelete({ _id: request.params.id, user: request.user.id })

  request.user.blogs = request.user.blogs.filter(
    blog => blog._id.toString() !== request.params.id
  )
  await request.user.save()

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
