import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiUserGroup } from 'react-icons/hi'
import BottomNav from '../../components/layout/BottomNav'
import { getMyChats, createGroupChat } from '../../api/chatAPI'
import { getMyConnections } from '../../api/connectionAPI'

function ChatList() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [connections, setConnections] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getMyChats(), getMyConnections()])
      .then(([chatsRes, connectionsRes]) => {
        setChats(chatsRes.data)
        setConnections(connectionsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return
    try {
      const res = await createGroupChat(groupName, selectedMembers)
      setShowGroupModal(false)
      navigate(`/chat/group/${res.data.chatId}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-4 z-50 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Chats</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowGroupModal(true)}>
            <HiUserGroup size={22} className="text-[#2B4593]" />
          </button>
          <HiPencilAlt size={22} className="text-[#2B4593]" />
        </div>
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
            <Link
              to={chat.is_group ? `/chat/group/${chat.id}` : `/chat/${chat.id}`}
              key={chat.id}
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 hover:bg-gray-50">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${chat.is_group ? 'bg-[#8EB3E7]' : 'bg-[#2B4593]'}`}>
                  {chat.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-800">{chat.name}</p>
                    <p className="text-xs text-gray-400">
                      {chat.last_message_time ? new Date(chat.last_message_time).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{chat.last_message || 'No messages yet'}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-sm p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">Create Group</h3>
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] mb-4"
            />
            <p className="text-xs text-gray-400 mb-2 font-semibold">Select members from connections</p>
            {connections.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleMember(c.connected_user_id)}
                className={`flex items-center gap-3 w-full py-3 border-b border-gray-50 ${selectedMembers.includes(c.connected_user_id) ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMembers.includes(c.connected_user_id) ? 'border-[#2B4593] bg-[#2B4593]' : 'border-gray-300'}`}>
                  {selectedMembers.includes(c.connected_user_id) && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm">
                  {c.full_name?.charAt(0)}
                </div>
                <p className="text-sm text-gray-800">{c.full_name}</p>
              </button>
            ))}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowGroupModal(false)}
                className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 bg-[#2B4593] text-white py-2 rounded-xl text-sm font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

export default ChatList