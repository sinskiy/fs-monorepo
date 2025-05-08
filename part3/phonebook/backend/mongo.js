import mongoose from 'mongoose'

const password = process.argv[2]

if (!password) {
  console.log('give password as argument')
  process.exit(1)
}

const url = `mongodb+srv://sinskiy:${password}@phonebook.yjkdq57.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const [name, number] = process.argv.slice(3)
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}
