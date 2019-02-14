import axios from 'axios'
const baseUrl = 'http://localhost:3100/invim/current'

const getLatest = () => {
  // http://localhost:3100/invim/current
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getTodayAll = () => {
  // http://localhost:3100/invim/current/today
  const request = axios.get(`${baseUrl}/today`);
  return request.then(response => response.data);
}

const getTodayAmount = (amount) => {
  // http://localhost:3100/invim/current/today/:amount
  const request = axios.get(`${baseUrl}/today/${amount}`);
  return request.then(response => response.data);
}

const getTimeBased = (year, month, date, hour) => {
  // http://localhost:3100/invim/current/date/:year/:month/:date/:hour
  const request = axios.get(`${baseUrl}/date/${year}/${month}/${date}/${hour}`);
  return request.then(response => response.data);
}

const create = (newObject) => {
  // .../invim/current/ (POST)
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

export default { getLatest, getTodayAll, getTodayAmount, getTimeBased, create }