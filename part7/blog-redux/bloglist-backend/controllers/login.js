import { Router } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  if (!user)
    return response.status(401).json({ error: 'invalid username or password' })

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect)
    return response.status(401).json({ error: 'invalid username or password' })

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  response.json({ token, username: user.username, name: user.name })
})

export default loginRouter
