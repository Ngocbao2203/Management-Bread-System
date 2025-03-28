import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Combo API endpoints
export const comboApi = {
  getAll: (page = 1, size = 10) =>
    api.get('/api/combo/get-list', { params: { page, size } }),
  getById: (id) => api.get(`/api/combo/get-by-id/${id}`),
  create: (data) => api.post('/api/combo/create', data),
  update: (id, data) => api.put(`/api/combo/update/${id}`, data),
  delete: (id) => api.delete(`/api/combo/${id}`),
}

// Product API endpoints
export const productApi = {
  getAll: (page = 1, size = 10) =>
    api.get('api/product/get-list', { params: { page, size } }),
  getById: (id) => api.get(`/api/product/get-by-id/${id}`),
}

export default api
