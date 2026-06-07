import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiPencilAlt } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getMyChats } from '../../api/chatAPI'

function ChatList() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyChats()
      .then((res) => setChats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 z-50 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Chats</h1>
        <HiPencilAlt size={22} className="text-[#2B4593]" />
      </div>

      <div className="pt-16 px-4 py-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      <div>
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-10">Loading...</p>
        ) : chats.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <Link to={`/chat/${chat.id}`} key={chat.id}>
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${chat.is_group ? 'bg-[#8EB3E7]' : 'bg-[#2B4593]'}`}>
                  {chat.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-800">{chat.name}</p>
                    <p className="text-xs text-gray-400">{new Date(chat.last_message_time).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.last_message}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export default ChatList