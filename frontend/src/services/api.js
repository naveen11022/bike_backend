import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // ❗ Only set JSON content type when sending JSON
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // 401 = unauthorized, 422 with auth header issue = token missing/invalid
    if (error.response?.status === 401 || 
        (error.response?.status === 422 && error.response?.data?.detail?.some?.(d => d.loc?.includes('authorization')))) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
