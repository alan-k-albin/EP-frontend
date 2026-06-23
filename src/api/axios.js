import axios from 'axios'

const API = axios.create({
  baseURL: 'https://ep-backend-1vay.onrender.com/api',
})

// Attach access token to every request
// Handle both old 'token' key and new 'accessToken' key
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
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

      // If no refresh token, just clear and continue
      // Don't force redirect — let AuthContext handle it
      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('token')
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
        // Remove old token key if exists
        localStorage.removeItem('token')

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return API(originalRequest)
      } catch (refreshError) {
        // Refresh failed — clear everything but don't force redirect
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default API