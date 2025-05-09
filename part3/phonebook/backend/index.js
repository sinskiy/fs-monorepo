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
  Person.find({}).then(persons =>
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
  )
})

app
  .route('/api/persons')
  .get((req, res, next) =>
    Person.find({})
      .then(persons => res.json(persons))
      .catch(err => next(err))
  )
  .post((req, res, next) => {
    if (!req.body.name || !req.body.number) {
      return res.status(400).json({ error: 'name and number must be present' })
    }

    const person = new Person({
      name: req.body.name,
      number: req.body.number,
    })
    person
      .save()
      .then(result => res.json(result))
      .catch(err => next(err))
  })

app
  .route('/api/persons/:id')
  .get((req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => next(err))
  })
  .delete((req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then(() => res.status(204).end())
      .catch(err => next(err))
  })
  .patch((req, res, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person) {
          person.number = req.body.number
          person
            .save()
            .then(newPerson => res.json(newPerson))
            .catch(err => next(err))
        } else {
          res.status(404).end()
        }
      })
      .catch(err => next(err))
  })

app.use((req, res) => res.status(404).send({ error: 'unknown endpoint' }))

app.use((err, req, res, next) => {
  console.error(err)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
