import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiHome, HiChat, HiBell, HiUser } from 'react-icons/hi'
import { HiMenuAlt3 } from 'react-icons/hi'
import { useNotifications } from '../../context/NotificationContext'
import API from '../../api/axios'

function BottomNav() {
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const { unreadCount, resetCount } = useNotifications()
  const [unreadChats, setUnreadChats] = useState(0)

  const isActive = (path) => location.pathname === path

  // Fetch unread chat count every 30 seconds
  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const res = await API.get('/chat/unread-count')
        setUnreadChats(parseInt(res.data.count) || 0)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUnreadChats()
    const interval = setInterval(fetchUnreadChats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Reset chat unread count when user visits chat page
  useEffect(() => {
    if (location.pathname === '/chat') {
      setUnreadChats(0)
    }
  }, [location.pathname])

  return (
    <>
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}>
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-48 z-50">
            <Link to="/feed/a" onClick={() => setShowMenu(false)}>
              <div className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                <p className="text-lg font-bold text-[#2B4593]">A</p>
              </div>
            </Link>
            <Link to="/feed/b" onClick={() => setShowMenu(false)}>
              <div className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                <p className="text-lg font-bold text-[#2B4593]">B</p>
              </div>
            </Link>
            <Link to="/feed/c" onClick={() => setShowMenu(false)}>
              <div className="px-6 py-4 hover:bg-gray-50">
                <p className="text-lg font-bold text-[#2B4593]">C</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 z-50">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-[#2B4593]' : 'text-gray-400'}`}>
          <HiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Chat with unread badge */}
        <Link
          to="/chat"
          className={`flex flex-col items-center relative ${isActive('/chat') ? 'text-[#2B4593]' : 'text-gray-400'}`}
        >
          <HiChat size={24} />
          <span className="text-xs mt-1">Chat</span>
          {unreadChats > 0 && (
            <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {unreadChats > 9 ? '9+' : unreadChats}
            </span>
          )}
        </Link>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex flex-col items-center ${showMenu ? 'text-[#2B4593]' : 'text-gray-400'}`}
        >
          <HiMenuAlt3 size={24} />
          <span className="text-xs mt-1">Sort</span>
        </button>

        <Link
          to="/notifications"
          onClick={resetCount}
          className={`flex flex-col items-center relative ${isActive('/notifications') ? 'text-[#2B4593]' : 'text-gray-400'}`}
        >
          <HiBell size={24} />
          <span className="text-xs mt-1">Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-[#2B4593]' : 'text-gray-400'}`}>
          <HiUser size={24} />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </>
  )
}

export default BottomNav