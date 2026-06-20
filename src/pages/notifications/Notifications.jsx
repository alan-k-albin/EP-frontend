import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/layout/BottomNav'
import { getNotifications, markAsRead } from '../../api/notificationAPI'

const getNotificationLink = (notif) => {
  switch (notif.type) {
    case 'like':
    case 'comment':
    case 'attempted':
    case 'repost':
      return notif.related_id ? `/post/${notif.related_id}` : null
    case 'connection_request':
      return '/connections/requests'
    case 'connection_accepted':
      return notif.sender_id ? `/user/${notif.sender_id}` : '/connections'
    default:
      return null
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'like': return '👍'
    case 'comment': return '💬'
    case 'attempted': return '🙋'
    case 'repost': return '🔁'
    case 'connection_request': return '🤝'
    case 'connection_accepted': return '✅'
    default: return '🔔'
  }
}

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getNotifications()
      .then((res) => {
        setNotifications(res.data)
        return markAsRead()
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (notif) => {
    const link = getNotificationLink(notif)
    if (link) navigate(link)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50">
        <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="pt-16">
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-gray-400 text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const link = getNotificationLink(notif)
            return (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`flex items-center gap-3 px-4 py-4 border-b border-gray-100 transition-colors ${
                  !notif.is_read ? 'bg-[#8EB3E7]/10' : 'bg-white'
                } ${link ? 'cursor-pointer active:bg-gray-50 hover:bg-gray-50' : ''}`}
              >
                {/* Sender Avatar */}
                <div className="relative flex-shrink-0">
                  {notif.sender_photo ? (
                    <img
                      src={notif.sender_photo}
                      alt="sender"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                      {notif.sender_name?.charAt(0) || 'E'}
                    </div>
                  )}
                  {/* Notification type icon badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs shadow-sm border border-gray-100">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Unread dot + arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notif.is_read && (
                    <div className="w-2 h-2 rounded-full bg-[#2B4593]"></div>
                  )}
                  {link && (
                    <span className="text-gray-300 text-sm">›</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default Notifications