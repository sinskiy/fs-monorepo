import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (persons.some(({ name }) => name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons([...persons, { name: newName, number: newNumber }])

      setNewName(''), setNewNumber('')
    }
  }

  const [search, setSearch] = useState('')
  const result = persons.filter(filterPersons(search))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons result={result} />
    </div>
  )
}

export default App

const filterPersons =
  (search) =>
  ({ name, number }) =>
    name.toLowerCase().includes(search.toLowerCase()) ||
    number.toLowerCase().includes(search.toLowerCase())

const Filter = ({ search, setSearch }) => (
  <search style={{ marginBottom: 16 }}>
    <form>
      <label htmlFor="search">filter shown with </label>
      <input
        type="search"
        id="search"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
    </form>
  </search>
)

const PersonForm = ({
  onSubmit,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name:{' '}
      <input
        type="text"
        id="name"
        value={newName}
        onChange={(e) => setNewName(e.currentTarget.value)}
      />
    </div>
    <div>
      number:{' '}
      <input
        type="tel"
        id="number"
        value={newNumber}
        onChange={(e) => setNewNumber(e.currentTarget.value)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ result }) => (
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {result.map(({ number, name }) => (
      <li key={name}>
        <span>{name}</span> <span>{number}</span>
      </li>
    ))}
  </ul>
)
