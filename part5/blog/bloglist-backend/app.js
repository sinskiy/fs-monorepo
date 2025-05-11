import express from 'express'
import {
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
} from './utils/middleware.js'
import { error, info } from './utils/logger.js'
import blogsRouter from './controllers/blogs.js'
import config from './utils/config.js'
import mongoose from 'mongoose'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'

const app = express()

info('connecting to', config.MONGODB_URL)

mongoose
  .connect(config.MONGODB_URL)
  .then(() => info('connected to MongoDB'))
  .catch(err => error('error connection to MongoDB:', err.message))

app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
