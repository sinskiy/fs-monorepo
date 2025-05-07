import axios from 'axios'

const baseUrl = '/api/persons'

const getAllPersons = () => axios.get(baseUrl).then(response => response.data)

const createPerson = (name, number) =>
  axios.post(baseUrl, { name, number }).then(response => response.data)

const updatePersonNumber = (id, number) =>
  axios.patch(`${baseUrl}/${id}`, { number }).then(response => response.data)

const deletePerson = id =>
  axios.delete(`${baseUrl}/${id}`).then(response => response.data)

export default { getAllPersons, createPerson, updatePersonNumber, deletePerson }
