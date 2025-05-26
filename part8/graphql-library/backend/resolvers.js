import { GraphQLError } from 'graphql'
import Author from './models/Author.js'
import Book from './models/Book.js'
import User from './models/User.js'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'

const pubSub = new PubSub()

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
    allAuthors: async () => {
      const authors = await Author.find().populate('books')
      const authorsWithBookCount = authors.map(author => ({
        ...author,
        books: undefined,
        bookCount: author.books.length,
      }))
      return authorsWithBookCount
    },
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

        const withAuthor = await book.populate('author')

        pubSub.publish('BOOK_ADDED', { bookAdded: withAuthor })

        return withAuthor
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

export default resolvers
