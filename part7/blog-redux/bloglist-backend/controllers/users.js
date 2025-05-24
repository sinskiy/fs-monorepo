import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })

  response.json(users)
})

usersRouter.get('/:userId', async (request, response) => {
  const user = await User.findById(request.params.userId).populate('blogs', {
    title: 1,
  })

  if (!user) return response.status(404).json({ error: 'user not found' })

  response.json(user)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.insertOne({ username, name, passwordHash })

  response.status(201).json(user)
})

export default usersRouter
