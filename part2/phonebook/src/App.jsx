import { useEffect } from 'react'
import { useState } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personsService
      .getAllPersons()
      .then(data => setPersons(data))
      .catch(() =>
        setNotification({
          status: 'error',
          text: 'Persons could not be fetched',
        })
      )
  }, [])

  const updateNotification = newNotification => {
    setNotification(newNotification)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson !== undefined) {
      const doReplace = confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )
      if (doReplace) {
        personsService
          .updatePersonNumber(existingPerson.id, newNumber)
          .then(data => {
            setPersons(
              persons.map(person => (person.id === data.id ? data : person))
            )
            updateNotification({
              status: 'success',
              text: `Updated ${data.name}'s number from ${existingPerson.number} to ${data.number}`,
            })
          })
          .catch(() =>
            setNotification({
              status: 'error',
              text: 'Person could not be replaced. It could be deleted. Try to reload the page',
            })
          )
      }
    } else {
      setNewName(''), setNewNumber('')

      personsService
        .createPerson(newName, newNumber)
        .then(data => {
          updateNotification({
            status: 'success',
            text: `Added ${data.name}`,
          })
          setPersons([...persons, data])
        })
        .catch(() =>
          setNotification({
            status: 'error',
            text: 'Person could not be created',
          })
        )
    }
  }

  const handleDeleteClick = (id, name) => {
    const doDelete = confirm(`Delete ${name}?`)
    if (doDelete) {
      personsService
        .deletePerson(id)
        .then(data => {
          setPersons(persons.filter(person => person.id !== data.id))
          updateNotification({
            status: 'success',
            text: `Deleted ${data.name}`,
          })
        })
        .catch(() =>
          updateNotification({
            status: 'error',
            text: 'Person could not be deleted. Perhaps it has already been deleted. Try to reload the page',
          })
        )
    }
  }

  const [search, setSearch] = useState('')
  const result = persons.filter(filterPersons(search))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status={notification?.status} text={notification?.text} />
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
      <Persons persons={result} onDeleteClick={handleDeleteClick} />
    </div>
  )
}

export default App

const filterPersons =
  search =>
  ({ name, number }) =>
    name.toLowerCase().includes(search.toLowerCase()) ||
    number.toLowerCase().includes(search.toLowerCase())

const Notification = ({ status, text }) =>
  status && <div className={`notification ${status}`}>{text}</div>

const Filter = ({ search, setSearch }) => (
  <search style={{ marginBottom: 16 }}>
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="search">filter shown with </label>
      <input
        type="search"
        id="search"
        name="search"
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
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
        onChange={e => setNewName(e.currentTarget.value)}
      />
    </div>
    <div>
      number:{' '}
      <input
        type="tel"
        id="number"
        value={newNumber}
        onChange={e => setNewNumber(e.currentTarget.value)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDeleteClick }) => (
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {persons.map(({ id, number, name }) => (
      <li key={name}>
        <span>{name}</span> <span>{number}</span>
        <button onClick={() => onDeleteClick(id, name)}>delete</button>
      </li>
    ))}
  </ul>
)
