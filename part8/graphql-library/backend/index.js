import { ApolloServer } from '@apollo/server'
import Book from './models/Book.js'
import Author from './models/Author.js'
import mongoose from 'mongoose'
import 'dotenv/config'
import User from './models/User.js'
import jwt from 'jsonwebtoken'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import express, { json } from 'express'
import http from 'node:http'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'

console.log('connecting to', process.env.MONGODB_URL)

mongoose
  .connect(process.env.MONGODB_URL)
  .then(async () => {
    console.log('connected to MongoDB')
    await Author.deleteMany()
    await Book.deleteMany()
    const authors = await Author.insertMany([
      { name: 'Robert Martin', born: 1952 },
      { name: 'Martin Fowler', born: 1963 },
      { name: 'Fyodor Dostoevsky', born: 1821 },
      { name: 'Joshua Kerievsky' },
      { name: 'Sandi Metz' },
    ])
    await Book.insertMany([
      {
        title: 'Clean Code',
        published: 2008,
        author: authors[0]._id,
        genres: ['refactoring'],
      },
      {
        title: 'Agile software development',
        published: 2002,
        author: authors[0]._id,
        genres: ['agile', 'patterns', 'design'],
      },
      {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: authors[1]._id,
        genres: ['refactoring'],
      },
      {
        title: 'Refactoring to patterns',
        published: 2008,
        author: authors[3]._id,
        genres: ['refactoring', 'patterns'],
      },
      {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: authors[4]._id,
        genres: ['refactoring', 'design'],
      },
      {
        title: 'Crime and punishment',
        published: 1866,
        author: authors[2]._id,
        genres: ['classic', 'crime'],
      },
      {
        title: 'Demons',
        published: 1872,
        author: authors[2]._id,
        genres: ['classic', 'revolution'],
      },
    ])
  })
  .catch(error => console.log('error connecting to MongoDB:', error.message))

mongoose.set('debug', true)

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}`))
}

start()
