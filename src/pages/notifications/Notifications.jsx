import { useState, useEffect } from 'react'
import BottomNav from '../../components/layout/BottomNav'
import { getNotifications, markAsRead } from '../../api/notificationAPI'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then((res) => {
        setNotifications(res.data)
        return markAsRead()
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50">
        <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="pt-16">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No notifications yet</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`flex items-center gap-3 px-4 py-4 border-b border-gray-100 ${!notif.is_read ? 'bg-[#8EB3E7]/10' : 'bg-white'}`}>
              <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                EP
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
              </div>
              {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[#2B4593] flex-shrink-0"></div>}
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default Notifications