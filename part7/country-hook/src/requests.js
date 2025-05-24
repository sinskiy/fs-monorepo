import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'

export const getCountry = async country =>
  (await axios.get(`${baseUrl}/${country}`)).data
