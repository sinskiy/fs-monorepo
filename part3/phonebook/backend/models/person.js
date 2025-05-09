import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: num => {
        const parts = num.split('-')
        return (
          parts.length === 2 &&
          num.every(part => String(parseInt(part)) === part)
        )
      },
    },
  },
})

const Person = mongoose.model('Person', personSchema)
export default Person
