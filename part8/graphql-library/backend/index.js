import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import Book from './models/Book.js'
import Author from './models/Author.js'
import mongoose from 'mongoose'
import 'dotenv/config'
import { GraphQLError } from 'graphql'
import User from './models/User.js'
import jwt from 'jsonwebtoken'

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

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Author {
    name: String!
    id: ID!
    born: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, published: Int!, author: String!, genres: [String!]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find(
        args.genre ? { genres: args.genre } : undefined
      ).populate('author')
      return args.author
        ? books.filter(book => book.author.name === args.author)
        : books
    },
    allAuthors: async () => Author.find(),
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = await Author.insertOne({ name: args.author })
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      try {
        const book = await Book.insertOne({
          ...args,
          author: author._id,
        })
        return await book.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', error },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo }
      )
      console.log(author, args)
      return author
    },
    createUser: async (root, args) => {
      try {
        const user = await User.insertOne({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        })
        return user
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_SECRET
      )
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
