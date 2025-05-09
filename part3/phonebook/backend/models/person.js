import mongoose from 'mongoose'
import 'dotenv/config'

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
export default Person
