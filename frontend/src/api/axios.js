import axios from 'axios'

const baseURL = 'https://women-s-fashion-collectionss.onrender.com/api'

const api = axios.create({ baseURL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('wfc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wfc_token')
      localStorage.removeItem('wfc_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api