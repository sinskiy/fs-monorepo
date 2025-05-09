import express from 'express'
import morgan from 'morgan'
import Person from './models/person.js'

morgan.token('body', req => JSON.stringify(req.body))

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/info', (req, res) => {
  res.type('html')
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date().toString()}</p>
</body>
</html>
  `)
})

app
  .route('/api/persons')
  .get((req, res) => Person.find({}).then(persons => res.json(persons)))
  .post((req, res) => {
    if (!req.body.name || !req.body.number) {
      return res.status(400).json({ error: 'name and number must be present' })
    }

    const person = new Person({
      name: req.body.name,
      number: req.body.number,
    })
    person.save().then(result => res.json(result))
  })

app
  .route('/api/persons/:id')
  .get((req, res) => {
    const person = Person.findById(req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .delete((req, res) => {
    Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end())
  })

app.use((req, res) => res.status(404).send({ error: 'unknown endpoint' }))

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
