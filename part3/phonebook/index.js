import express from 'express'

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const app = express()
app.use(express.json())

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
  .get((req, res) => res.json(persons))
  .post((req, res) => {
    if (!req.body.name || !req.body.number) {
      res.status(400).json({ error: 'name and number must be present' })
    } else if (persons.some(person => person.name === req.body.name)) {
      res.status(400).json({ error: 'name must be unique' })
    } else {
      persons.push({
        id: String(Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1))),
        name: req.body.name,
        number: req.body.number,
      })
      res.end()
    }
  })

app
  .route('/api/persons/:id')
  .get((req, res) => {
    const person = persons.find(person => person.id === req.params.id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .delete((req, res) => {
    persons = persons.filter(person => person.id !== req.params.id)
    res.status(204).end()
  })

app.use((req, res) => res.status(404).send({ error: 'unknown endpoint' }))

const PORT = 3001
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
