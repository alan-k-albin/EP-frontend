import { createContext, useState, useEffect, useContext } from 'react'
import { getUnreadCount } from '../api/notificationAPI'
import { useAuth } from './AuthContext'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const fetchCount = () => {
      getUnreadCount()
        .then((res) => setUnreadCount(parseInt(res.data.count) || 0))
        .catch(() => setUnreadCount(0))
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  const resetCount = () => setUnreadCount(0)

  return (
    <NotificationContext.Provider value={{ unreadCount, resetCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)

export default NotificationContext