import { createContext, useState, useEffect, useContext } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      API.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      // Tell backend to delete refresh token
      await API.post('/auth/logout', { refreshToken })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext