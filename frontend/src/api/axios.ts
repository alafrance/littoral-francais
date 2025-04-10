import axios from 'axios'

console.log('NODE_ENV', process.env.NODE_ENV)
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api-littoral-app.onrender.com/' : 'http://localhost:8000',
  withCredentials: true,
})

export default api