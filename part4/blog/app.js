import express from 'express'
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from './utils/middleware.js'
import { error, info } from './utils/logger.js'
import blogsRouter from './controllers/blogs.js'
import config from './utils/config.js'
import mongoose from 'mongoose'

const app = express()

info('connecting to', config.MONGODB_URL)

mongoose
  .connect(config.MONGODB_URL)
  .then(() => info('connected to MongoDB'))
  .catch(err => error('error connection to MongoDB:', err.message))

app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
