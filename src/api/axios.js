import axios from 'axios'

const API = axios.create({
  baseURL: 'https://ep-backend-1vay.onrender.com/api',
})

// Attach access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh access token when it expires
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        // No refresh token — force logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(
          'https://ep-backend-1vay.onrender.com/api/auth/refresh',
          { refreshToken }
        )
        const { accessToken, refreshToken: newRefreshToken } = res.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return API(originalRequest)
      } catch (refreshError) {
        // Refresh failed — force logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API