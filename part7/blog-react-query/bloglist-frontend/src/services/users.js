import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => (await axios.get(baseUrl)).data
const getById = async id => (await axios.get(`${baseUrl}/${id}`)).data

export default { getAll, getById }
